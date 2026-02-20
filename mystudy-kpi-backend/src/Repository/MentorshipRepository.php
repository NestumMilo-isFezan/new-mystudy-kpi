<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Mentorship;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Mentorship>
 *
 * @method Mentorship|null find($id, $lockMode = null, $lockVersion = null)
 * @method Mentorship|null findOneBy(array $criteria, array $orderBy = null)
 * @method Mentorship[]    findAll()
 * @method Mentorship[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MentorshipRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Mentorship::class);
    }

    public function save(Mentorship $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Mentorship $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Efficiently finds ALL mentorships with total counts
     * and only the first 5 mentees to avoid N+1 and over-fetching in index views.
     *
     * @return array Array of arrays containing 'mentorship', 'menteeCount', and 'mentees' (limited to 5)
     */
    public function findAllWithCountsAndLimitedMentees(int $limit = 5): array
    {
        // 1. Fetch all mentorships and their total counts in one query
        $results = $this->createQueryBuilder('mentorship')
            ->select('mentorship', 'intakeBatch', 'lecturer', 'lecturerProfile')
            ->addSelect('(SELECT COUNT(m2.id) FROM App\Entity\Mentee m2 WHERE m2.mentorship = mentorship) as menteeCount')
            ->leftJoin('mentorship.intakeBatch', 'intakeBatch')
            ->leftJoin('mentorship.lecturer', 'lecturer')
            ->leftJoin('lecturer.profile', 'lecturerProfile')
            ->orderBy('mentorship.id', 'DESC')
            ->getQuery()
            ->getResult();

        if (empty($results)) {
            return [];
        }

        $mentorships = [];
        $mentorshipIds = [];
        foreach ($results as $row) {
            /** @var Mentorship $mentorship */
            $mentorship = $row[0];
            $id = $mentorship->getId();
            $mentorshipIds[] = $id;
            $mentorships[$id] = [
                'mentorship' => $mentorship,
                'menteeCount' => (int) $row['menteeCount'],
                'mentees' => [], // To be populated
            ];
        }

        // 2. Fetch only the top N mentees for these mentorships in one efficient native query (Top-N per group)
        $conn = $this->getEntityManager()->getConnection();
        $sql = "
            SELECT student_data.* 
            FROM (
                SELECT 
                    m.mentorship_id,
                    s.id as student_id,
                    ROW_NUMBER() OVER(PARTITION BY m.mentorship_id ORDER BY m.id ASC) as row_num
                FROM mentee m
                JOIN app_user s ON m.student_id = s.id
                WHERE m.mentorship_id IN (?)
            ) student_data
            WHERE student_data.row_num <= ?
        ";

        $resultSet = $conn->executeQuery($sql, [
            $mentorshipIds,
            $limit
        ], [
            \Doctrine\DBAL\ArrayParameterType::INTEGER,
            \Doctrine\DBAL\ParameterType::INTEGER
        ]);

        $studentIdsByMentorship = [];
        $allStudentIds = [];
        foreach ($resultSet->fetchAllAssociative() as $row) {
            $mId = (int)$row['mentorship_id'];
            $sId = $row['student_id'];
            $studentIdsByMentorship[$mId][] = $sId;
            $allStudentIds[] = $sId;
        }

        if (!empty($allStudentIds)) {
            // 3. Batch fetch the actual student user entities (with profiles if needed)
            $students = $this->getEntityManager()->getRepository(User::class)->createQueryBuilder('u')
                ->select('u', 'profile')
                ->leftJoin('u.profile', 'profile')
                ->where('u.id IN (:ids)')
                ->setParameter('ids', $allStudentIds)
                ->getQuery()
                ->getResult();

            $studentsById = [];
            foreach ($students as $student) {
                $studentsById[$student->getId()] = $student;
            }

            // 4. Map students back to their mentorships
            foreach ($studentIdsByMentorship as $mId => $sIds) {
                foreach ($sIds as $sId) {
                    if (isset($studentsById[$sId])) {
                        $mentorships[$mId]['mentees'][] = $studentsById[$sId];
                    }
                }
            }
        }

        return array_values($mentorships);
    }

    /**
     * Efficiently finds mentorships for a lecturer with total counts
     * and only the first 5 mentees to avoid N+1 and over-fetching in index views.
     *
     * @return array Array of arrays containing 'mentorship', 'menteeCount', and 'mentees' (limited to 5)
     */
    public function findByLecturerWithCountsAndLimitedMentees(User $lecturer, int $limit = 5): array
    {
        // 1. Fetch mentorships and their total counts in one query
        $results = $this->createQueryBuilder('mentorship')
            ->select('mentorship', 'intakeBatch')
            ->addSelect('(SELECT COUNT(m2.id) FROM App\Entity\Mentee m2 WHERE m2.mentorship = mentorship) as menteeCount')
            ->leftJoin('mentorship.intakeBatch', 'intakeBatch')
            ->where('mentorship.lecturer = :lecturer')
            ->setParameter('lecturer', $lecturer)
            ->orderBy('mentorship.id', 'DESC')
            ->getQuery()
            ->getResult();

        if (empty($results)) {
            return [];
        }

        $mentorships = [];
        $mentorshipIds = [];
        foreach ($results as $row) {
            /** @var Mentorship $mentorship */
            $mentorship = $row[0];
            $id = $mentorship->getId();
            $mentorshipIds[] = $id;
            $mentorships[$id] = [
                'mentorship' => $mentorship,
                'menteeCount' => (int) $row['menteeCount'],
                'mentees' => [], // To be populated
            ];
        }

        // 2. Fetch only the top N mentees for these mentorships in one efficient native query (Top-N per group)
        $conn = $this->getEntityManager()->getConnection();
        $sql = "
            SELECT student_data.* 
            FROM (
                SELECT 
                    m.mentorship_id,
                    s.id as student_id,
                    ROW_NUMBER() OVER(PARTITION BY m.mentorship_id ORDER BY m.id ASC) as row_num
                FROM mentee m
                JOIN app_user s ON m.student_id = s.id
                WHERE m.mentorship_id IN (?)
            ) student_data
            WHERE student_data.row_num <= ?
        ";

        $resultSet = $conn->executeQuery($sql, [
            $mentorshipIds,
            $limit
        ], [
            \Doctrine\DBAL\ArrayParameterType::INTEGER,
            \Doctrine\DBAL\ParameterType::INTEGER
        ]);

        $studentIdsByMentorship = [];
        $allStudentIds = [];
        foreach ($resultSet->fetchAllAssociative() as $row) {
            $mId = (int)$row['mentorship_id'];
            $sId = $row['student_id'];
            $studentIdsByMentorship[$mId][] = $sId;
            $allStudentIds[] = $sId;
        }

        if (!empty($allStudentIds)) {
            // 3. Batch fetch the actual student user entities (with profiles if needed)
            $students = $this->getEntityManager()->getRepository(User::class)->createQueryBuilder('u')
                ->select('u', 'profile')
                ->leftJoin('u.profile', 'profile')
                ->where('u.id IN (:ids)')
                ->setParameter('ids', $allStudentIds)
                ->getQuery()
                ->getResult();

            $studentsById = [];
            foreach ($students as $student) {
                $studentsById[$student->getId()] = $student;
            }

            // 4. Map students back to their mentorships
            foreach ($studentIdsByMentorship as $mId => $sIds) {
                foreach ($sIds as $sId) {
                    if (isset($studentsById[$sId])) {
                        $mentorships[$mId]['mentees'][] = $studentsById[$sId];
                    }
                }
            }
        }

        return array_values($mentorships);
    }

    /**
     * @return Mentorship[]
     */
    public function findByLecturerWithRelations(User $lecturer): array
    {
        return $this->createQueryBuilder('mentorship')
            ->leftJoin('mentorship.intakeBatch', 'intakeBatch')->addSelect('intakeBatch')
            ->leftJoin('mentorship.mentees', 'mentee')->addSelect('mentee')
            ->leftJoin('mentee.student', 'student')->addSelect('student')
            ->leftJoin('student.profile', 'profile')->addSelect('profile')
            ->where('mentorship.lecturer = :lecturer')
            ->setParameter('lecturer', $lecturer)
            ->orderBy('mentorship.id', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
