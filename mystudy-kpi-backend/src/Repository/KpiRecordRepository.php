<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\KpiRecord;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<KpiRecord>
 */
class KpiRecordRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, KpiRecord::class);
    }

    /**
     * @return KpiRecord[]
     */
    public function findByStudent(\App\Entity\User $student): array
    {
        return $this->createQueryBuilder('k')
            ->join('k.record', 's')
            ->where('s.student = :student')
            ->setParameter('student', $student)
            ->orderBy('s.academicYear', 'DESC')
            ->addOrderBy('s.semester', 'DESC')
            ->addOrderBy('k.id', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
