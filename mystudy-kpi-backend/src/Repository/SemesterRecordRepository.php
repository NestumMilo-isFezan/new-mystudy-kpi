<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\SemesterRecord;
use App\Entity\User;
use App\Enum\SortableAcademicColumn;
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

    /**
     * @return SemesterRecord[]
     */
    public function findByStudentSortedFiltered(
        User $student,
        SortableAcademicColumn $sortBy,
        string $sortDir,
        ?int $semester = null,
    ): array {
        $direction = $sortDir === 'DESC' ? 'DESC' : 'ASC';

        $qb = $this->createQueryBuilder('s')
            ->leftJoin('s.cgpaRecord', 'c')
            ->where('s.student = :student')
            ->setParameter('student', $student);

        if ($semester !== null) {
            $qb->andWhere('s.semester = :semester')->setParameter('semester', $semester);
        }

        if ($sortBy === SortableAcademicColumn::AcademicYear) {
            $qb
                ->orderBy('s.academicYear', $direction)
                ->addOrderBy('s.semester', $direction)
                ->addOrderBy('s.id', 'DESC');
        } elseif ($sortBy === SortableAcademicColumn::Semester) {
            $qb
                ->orderBy('s.semester', $direction)
                ->addOrderBy('s.academicYear', $direction)
                ->addOrderBy('s.id', 'DESC');
        } else {
            $qb
                ->orderBy('c.gpa', $direction)
                ->addOrderBy('s.academicYear', 'DESC')
                ->addOrderBy('s.semester', 'DESC')
                ->addOrderBy('s.id', 'DESC');
        }

        return $qb->getQuery()->getResult();
    }
}
