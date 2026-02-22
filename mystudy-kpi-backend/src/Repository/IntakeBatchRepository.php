<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\IntakeBatch;
use App\Enum\SortableIntakeColumn;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<IntakeBatch>
 */
class IntakeBatchRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, IntakeBatch::class);
    }

    /** @return IntakeBatch[] */
    public function findActiveBatches(): array
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('b.startYear', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByStartYear(int $startYear): ?IntakeBatch
    {
        return $this->findOneBy(['startYear' => $startYear]);
    }

    /**
     * @return array{items: IntakeBatch[], total: int}
     */
    public function findPaginated(
        int $page,
        int $limit,
        SortableIntakeColumn $sortBy,
        string $sortDir,
        ?bool $isActive = null,
    ): array {
        $offset = (max(1, $page) - 1) * $limit;
        $direction = $sortDir === 'DESC' ? 'DESC' : 'ASC';

        $qb = $this->createQueryBuilder('b');

        if ($isActive !== null) {
            $qb->andWhere('b.isActive = :isActive')->setParameter('isActive', $isActive);
        }

        $qb
            ->orderBy($sortBy->value, $direction)
            ->addOrderBy('b.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        $paginator = new Paginator($qb, false);

        return [
            'items' => iterator_to_array($paginator),
            'total' => count($paginator),
        ];
    }
}
