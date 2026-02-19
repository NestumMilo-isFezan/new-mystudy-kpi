<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Challenge;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
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
}
