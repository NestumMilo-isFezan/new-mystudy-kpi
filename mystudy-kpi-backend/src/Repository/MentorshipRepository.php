<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Mentorship;
use App\Entity\User;
use App\Enum\SortableMentorshipColumn;
use Doctrine\ORM\Tools\Pagination\Paginator;
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
     * @return array{items: array<int, array{mentorship: Mentorship, menteeCount: int, mentees: array<int, User>}>, total: int}
     */
    public function findAllPaginated(
        int $page,
        int $limit,
        SortableMentorshipColumn $sortBy,
        string $sortDir,
        ?int $startYear = null,
        ?string $lecturerId = null,
    ): array {
        return $this->findPaginatedWithPreview(
            null,
            $page,
            $limit,
            $sortBy,
            $sortDir,
            $startYear,
            $lecturerId,
        );
    }

    /**
     * @return array{items: array<int, array{mentorship: Mentorship, menteeCount: int, mentees: array<int, User>}>, total: int}
     */
    public function findByLecturerPaginated(
        User $lecturer,
        int $page,
        int $limit,
        SortableMentorshipColumn $sortBy,
        string $sortDir,
        ?int $startYear = null,
    ): array {
        return $this->findPaginatedWithPreview(
            $lecturer,
            $page,
            $limit,
            $sortBy,
            $sortDir,
            $startYear,
            null,
        );
    }

    /**
     * @return array{items: array<int, array{mentorship: Mentorship, menteeCount: int, mentees: array<int, User>}>, total: int}
     */
    private function findPaginatedWithPreview(
        ?User $lecturer,
        int $page,
        int $limit,
        SortableMentorshipColumn $sortBy,
        string $sortDir,
        ?int $startYear,
        ?string $lecturerId,
    ): array {
        $offset = (max(1, $page) - 1) * $limit;
        $direction = $sortDir === 'DESC' ? 'DESC' : 'ASC';

        $idsQb = $this->createQueryBuilder('mentorship')
            ->select('mentorship.id')
            ->leftJoin('mentorship.intakeBatch', 'intakeBatch')
            ->leftJoin('mentorship.lecturer', 'lecturer')
            ->addSelect('(SELECT COUNT(m2.id) FROM App\\Entity\\Mentee m2 WHERE m2.mentorship = mentorship) AS HIDDEN menteeCountSort');

        if ($lecturer !== null) {
            $idsQb
                ->andWhere('mentorship.lecturer = :lecturer')
                ->setParameter('lecturer', $lecturer);
        }

        if ($startYear !== null) {
            $idsQb
                ->andWhere('intakeBatch.startYear = :startYear')
                ->setParameter('startYear', $startYear);
        }

        if ($lecturer === null && $lecturerId !== null && $lecturerId !== '') {
            $idsQb
                ->andWhere('lecturer.id = :lecturerId')
                ->setParameter('lecturerId', $lecturerId);
        }

        $idsQb
            ->orderBy($sortBy->value, $direction)
            ->addOrderBy('mentorship.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        $paginator = new Paginator($idsQb, false);
        $total = count($paginator);

        $rows = $idsQb->getQuery()->getScalarResult();
        $mentorshipIds = array_map(
            static fn (array $row): int => (int) $row['id'],
            $rows,
        );

        if ($mentorshipIds === []) {
            return ['items' => [], 'total' => $total];
        }

        $mentorshipEntities = $this->createQueryBuilder('mentorship')
            ->select('mentorship', 'intakeBatch', 'lecturer', 'lecturerProfile')
            ->leftJoin('mentorship.intakeBatch', 'intakeBatch')
            ->leftJoin('mentorship.lecturer', 'lecturer')
            ->leftJoin('lecturer.profile', 'lecturerProfile')
            ->where('mentorship.id IN (:ids)')
            ->setParameter('ids', $mentorshipIds)
            ->getQuery()
            ->getResult();

        $mentorshipById = [];
        foreach ($mentorshipEntities as $mentorship) {
            $mentorshipById[$mentorship->getId()] = $mentorship;
        }

        $countRows = $this->getEntityManager()->createQueryBuilder()
            ->select('IDENTITY(m.mentorship) as mentorshipId', 'COUNT(m.id) as menteeCount')
            ->from('App\\Entity\\Mentee', 'm')
            ->where('m.mentorship IN (:ids)')
            ->setParameter('ids', $mentorshipIds)
            ->groupBy('m.mentorship')
            ->getQuery()
            ->getArrayResult();

        $countByMentorshipId = [];
        foreach ($countRows as $row) {
            $countByMentorshipId[(int) $row['mentorshipId']] = (int) $row['menteeCount'];
        }

        $menteesByMentorshipId = $this->fetchLimitedMenteesByMentorshipIds($mentorshipIds, 5);

        $items = [];
        foreach ($mentorshipIds as $mentorshipId) {
            if (!isset($mentorshipById[$mentorshipId])) {
                continue;
            }

            $items[] = [
                'mentorship' => $mentorshipById[$mentorshipId],
                'menteeCount' => $countByMentorshipId[$mentorshipId] ?? 0,
                'mentees' => $menteesByMentorshipId[$mentorshipId] ?? [],
            ];
        }

        return ['items' => $items, 'total' => $total];
    }

    /**
     * @param int[] $mentorshipIds
     *
     * @return array<int, array<int, User>>
     */
    private function fetchLimitedMenteesByMentorshipIds(array $mentorshipIds, int $limit = 5): array
    {
        if ($mentorshipIds === []) {
            return [];
        }

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

        $resultSet = $conn->executeQuery(
            $sql,
            [$mentorshipIds, $limit],
            [\Doctrine\DBAL\ArrayParameterType::INTEGER, \Doctrine\DBAL\ParameterType::INTEGER],
        );

        $studentIdsByMentorship = [];
        $allStudentIds = [];
        foreach ($resultSet->fetchAllAssociative() as $row) {
            $mentorshipId = (int) $row['mentorship_id'];
            $studentId = $row['student_id'];
            $studentIdsByMentorship[$mentorshipId][] = $studentId;
            $allStudentIds[] = $studentId;
        }

        if ($allStudentIds === []) {
            return [];
        }

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

        $menteesByMentorship = [];
        foreach ($studentIdsByMentorship as $mentorshipId => $studentIds) {
            foreach ($studentIds as $studentId) {
                if (!isset($studentsById[$studentId])) {
                    continue;
                }
                $menteesByMentorship[$mentorshipId][] = $studentsById[$studentId];
            }
        }

        return $menteesByMentorship;
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
