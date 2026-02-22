<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\KpiRecord;
use App\Entity\User;
use App\Enum\SortableKpiRecordColumn;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
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

    /**
     * @return array{items: KpiRecord[], total: int}
     */
    public function findByStudentPaginated(
        User $student,
        int $page,
        int $limit,
        SortableKpiRecordColumn $sortBy,
        string $sortDir,
        ?string $type = null,
    ): array {
        $offset = (max(1, $page) - 1) * $limit;
        $direction = $sortDir === 'DESC' ? 'DESC' : 'ASC';

        $qb = $this->createQueryBuilder('k')
            ->join('k.record', 's')
            ->where('s.student = :student')
            ->setParameter('student', $student);

        if ($type !== null) {
            $qb->andWhere('k.type = :type')->setParameter('type', $type);
        }

        if ($sortBy === SortableKpiRecordColumn::Semester) {
            $qb
                ->orderBy('s.academicYear', $direction)
                ->addOrderBy('s.semester', $direction)
                ->addOrderBy('k.id', 'DESC');
        } else {
            $qb
                ->orderBy($sortBy->value, $direction)
                ->addOrderBy('s.academicYear', 'DESC')
                ->addOrderBy('s.semester', 'DESC')
                ->addOrderBy('k.id', 'DESC');
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
