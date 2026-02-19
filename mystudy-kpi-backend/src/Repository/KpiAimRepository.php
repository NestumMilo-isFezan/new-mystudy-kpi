<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\KpiAim;
use App\Entity\IntakeBatch;
use App\Entity\User;
use App\Enum\KpiTargetSetBy;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<KpiAim>
 */
class KpiAimRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, KpiAim::class);
    }

    public function findLatestByStudentAndTargetSetBy(User $student, KpiTargetSetBy $targetSetBy): ?KpiAim
    {
        return $this->createQueryBuilder('k')
            ->where('k.student = :student')
            ->andWhere('k.targetSetBy = :targetSetBy')
            ->setParameter('student', $student)
            ->setParameter('targetSetBy', $targetSetBy)
            ->orderBy('k.id', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findLatestByBatchAndTargetSetBy(IntakeBatch $batch, KpiTargetSetBy $targetSetBy): ?KpiAim
    {
        return $this->createQueryBuilder('k')
            ->where('k.batch = :batch')
            ->andWhere('k.targetSetBy = :targetSetBy')
            ->setParameter('batch', $batch)
            ->setParameter('targetSetBy', $targetSetBy)
            ->orderBy('k.id', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
