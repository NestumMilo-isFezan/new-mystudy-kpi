<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\IntakeBatch;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
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
}
