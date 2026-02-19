<?php

declare(strict_types=1);

namespace App\Repository;

use App\Enum\UserRole;
use App\Entity\User;
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
}
