<?php

declare(strict_types=1);

namespace App\Repository;

use App\Enum\SortableUserColumn;
use App\Enum\UserRole;
use App\Entity\User;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @return User[]
     */
    public function findAvailableStudentsByBatch(int $batchId): array
    {
        $qb = $this->createQueryBuilder('u');
        $qb->leftJoin('App\Entity\Mentee', 'm', 'WITH', 'm.student = u.id')
            ->where('u.intakeBatch = :batchId')
            ->andWhere('u.role = :role')
            ->andWhere('m.id IS NULL')
            ->setParameter('batchId', $batchId)
            ->setParameter('role', UserRole::STUDENT->value);

        return $qb->getQuery()->getResult();
    }

    /**
     * @return User[]
     */
    public function findAllByRole(UserRole $role): array
    {
        return $this->createQueryBuilder('u')
            ->leftJoin('u.profile', 'p')
            ->addSelect('p')
            ->where('u.role = :role')
            ->setParameter('role', $role)
            ->orderBy('u.identifier', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return array{items: User[], total: int}
     */
    public function findByRolePaginated(
        UserRole $role,
        int $page,
        int $limit,
        SortableUserColumn $sortBy = SortableUserColumn::Identifier,
        string $sortDir = 'ASC',
        ?int $startYear = null,
    ): array {
        $offset = (max(1, $page) - 1) * $limit;

        $qb = $this->createQueryBuilder('u')
            ->leftJoin('u.profile', 'p')
            ->addSelect('p')
            ->leftJoin('u.intakeBatch', 'i')
            ->addSelect('i')
            ->where('u.role = :role')
            ->setParameter('role', $role)
            ->orderBy($sortBy->value, $sortDir === 'DESC' ? 'DESC' : 'ASC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        if ($startYear !== null) {
            $qb->andWhere('i.startYear = :startYear')
               ->setParameter('startYear', $startYear);
        }

        $paginator = new Paginator($qb, true);

        return [
            'items' => iterator_to_array($paginator->getIterator()),
            'total' => count($paginator),
        ];
    }
}
