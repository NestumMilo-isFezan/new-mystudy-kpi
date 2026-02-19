<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\SemesterRecord;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SemesterRecord>
 */
class SemesterRecordRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SemesterRecord::class);
    }

    public function findLatestWithCgpaByStudent(User $student): ?SemesterRecord
    {
        return $this->createQueryBuilder('s')
            ->innerJoin('s.cgpaRecord', 'c')
            ->where('s.student = :student')
            ->andWhere('c.gpa IS NOT NULL')
            ->setParameter('student', $student)
            ->orderBy('s.academicYear', 'DESC')
            ->addOrderBy('s.semester', 'DESC')
            ->addOrderBy('s.id', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
