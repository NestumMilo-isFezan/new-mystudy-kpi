<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Challenge;
use App\Entity\User;
use App\Enum\SortableChallengeColumn;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Challenge>
 */
class ChallengeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Challenge::class);
    }

    /**
     * @return Challenge[]
     */
    public function findByStudent(User $student): array
    {
        return $this->createQueryBuilder('c')
            ->join('c.record', 's')
            ->where('s.student = :student')
            ->setParameter('student', $student)
            ->orderBy('s.academicYear', 'DESC')
            ->addOrderBy('s.semester', 'DESC')
            ->addOrderBy('c.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return array{items: Challenge[], total: int}
     */
    public function findByStudentPaginated(
        User $student,
        int $page,
        int $limit,
        SortableChallengeColumn $sortBy,
        string $sortDir,
        ?int $semester = null,
    ): array {
        $offset = (max(1, $page) - 1) * $limit;
        $direction = $sortDir === 'DESC' ? 'DESC' : 'ASC';

        $qb = $this->createQueryBuilder('c')
            ->join('c.record', 's')
            ->where('s.student = :student')
            ->setParameter('student', $student);

        if ($semester !== null) {
            $qb->andWhere('s.semester = :semester')->setParameter('semester', $semester);
        }

        if ($sortBy === SortableChallengeColumn::Semester) {
            $qb
                ->orderBy('s.academicYear', $direction)
                ->addOrderBy('s.semester', $direction)
                ->addOrderBy('c.id', 'DESC');
        } else {
            $qb
                ->orderBy($sortBy->value, $direction)
                ->addOrderBy('s.academicYear', 'DESC')
                ->addOrderBy('s.semester', 'DESC')
                ->addOrderBy('c.id', 'DESC');
        }

        $qb
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        $paginator = new Paginator($qb, false);

        return [
            'items' => iterator_to_array($paginator),
            'total' => count($paginator),
        ];
    }
}
