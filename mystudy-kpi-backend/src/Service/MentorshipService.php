<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Mentee;
use App\Entity\Mentorship;
use App\Entity\User;
use App\Exception\NotFoundException;
use App\Exception\UnauthorizedException;
use App\Enum\SortableMentorshipColumn;
use App\Repository\IntakeBatchRepository;
use App\Repository\MenteeRepository;
use App\Repository\MentorshipRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

final class MentorshipService
{
    public function __construct(
        private readonly MentorshipRepository $mentorshipRepository,
        private readonly MenteeRepository $menteeRepository,
        private readonly UserRepository $userRepository,
        private readonly IntakeBatchRepository $intakeBatchRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @return array Array of arrays containing 'mentorship', 'menteeCount', and 'mentees' (limited to 5)
     */
    public function findByLecturerForIndex(User $lecturer): array
    {
        return $this->mentorshipRepository->findByLecturerWithCountsAndLimitedMentees($lecturer);
    }

    /**
     * @return array{items: array<int, array{mentorship: Mentorship, menteeCount: int, mentees: array<int, User>}>, total: int}
     */
    public function findByLecturerPage(
        User $lecturer,
        int $page,
        int $limit,
        SortableMentorshipColumn $sortBy,
        string $sortDir,
        ?int $startYear = null,
    ): array {
        return $this->mentorshipRepository->findByLecturerPaginated(
            $lecturer,
            $page,
            $limit,
            $sortBy,
            $sortDir,
            $startYear,
        );
    }

    /**
     * @return array Array of arrays containing 'mentorship', 'menteeCount', and 'mentees' (limited to 5)
     */
    public function findAllForIndex(): array
    {
        return $this->mentorshipRepository->findAllWithCountsAndLimitedMentees();
    }

    /**
     * @return array{items: array<int, array{mentorship: Mentorship, menteeCount: int, mentees: array<int, User>}>, total: int}
     */
    public function findAllPage(
        int $page,
        int $limit,
        SortableMentorshipColumn $sortBy,
        string $sortDir,
        ?int $startYear = null,
        ?string $lecturerId = null,
    ): array {
        return $this->mentorshipRepository->findAllPaginated(
            $page,
            $limit,
            $sortBy,
            $sortDir,
            $startYear,
            $lecturerId,
        );
    }

    /**
     * @return Mentorship[]
     */
    public function findByLecturer(User $lecturer): array
    {
        return $this->mentorshipRepository->findByLecturerWithRelations($lecturer);
    }

    public function findById(int $id, User $lecturer): Mentorship
    {
        $mentorship = $this->mentorshipRepository->find($id);
        if (!$mentorship || $mentorship->getLecturer()->getId() !== $lecturer->getId()) {
            throw new NotFoundException('Mentorship record not found or access denied.');
        }

        return $mentorship;
    }

    public function findByIdGlobal(int $id): Mentorship
    {
        $mentorship = $this->mentorshipRepository->find($id);
        if (!$mentorship) {
            throw new NotFoundException('Mentorship record not found.');
        }

        return $mentorship;
    }

    public function findMenteeByStudentId(string $studentId, User $lecturer): Mentee
    {
        $mentee = $this->menteeRepository->findOneByStudentIdAndLecturer($studentId, $lecturer);
        if (!$mentee) {
            throw new NotFoundException('Student not found in your mentorship list.');
        }

        return $mentee;
    }

    /**
     * @return Mentee[]
     */
    public function findAllMentees(): array
    {
        return $this->menteeRepository->findAll();
    }

    public function updateMenteeNotes(string $studentId, ?string $notes): Mentee
    {
        $student = $this->userRepository->find($studentId);
        if (!$student) {
            throw new NotFoundException('Student not found.');
        }

        $mentee = $this->menteeRepository->findOneBy(['student' => $student]);
        if (!$mentee) {
            throw new NotFoundException('Student is not assigned to any lecturer.');
        }

        $mentee->setNotes($notes);
        $this->entityManager->flush();

        return $mentee;
    }

    /**
     * @return User[]
     */
    public function findAvailableStudents(int $batchId): array
    {
        return $this->userRepository->findAvailableStudentsByBatch($batchId);
    }

    /**
     * @param string[] $studentIds
     */
    public function createMentorshipForLecturer(string $lecturerId, int $batchId, array $studentIds): Mentorship
    {
        $lecturer = $this->userRepository->find($lecturerId);
        if (!$lecturer || $lecturer->getRole()->value !== \App\Enum\UserRole::LECTURER->value) {
            throw new NotFoundException('Lecturer not found.');
        }

        return $this->createMentorship($lecturer, $batchId, $studentIds);
    }

    /**
     * @param string[] $studentIds
     */
    public function createMentorship(User $lecturer, int $batchId, array $studentIds): Mentorship
    {
        $studentIds = array_values(array_unique($studentIds));

        $batch = $this->intakeBatchRepository->find($batchId);
        if (!$batch) {
            throw new NotFoundException('Intake batch not found.');
        }

        $mentorship = $this->mentorshipRepository->findOneBy([
            'lecturer' => $lecturer,
            'intakeBatch' => $batch,
        ]);

        if (!$mentorship) {
            $mentorship = (new Mentorship())
                ->setLecturer($lecturer)
                ->setIntakeBatch($batch);
            $this->entityManager->persist($mentorship);
        }

        foreach ($studentIds as $studentId) {
            $student = $this->userRepository->find($studentId);
            if (!$student || $student->getIntakeBatch()?->getId() !== $batchId) {
                continue; // Skip invalid or mismatched students
            }

            // Check if student already has a mentor (OneToOne-like check via Mentee)
            $existingMentee = $this->menteeRepository->findOneBy(['student' => $student]);
            if ($existingMentee) {
                continue; // Skip already assigned
            }

            $mentee = (new Mentee())
                ->setMentorship($mentorship)
                ->setStudent($student);

            $mentorship->addMentee($mentee);
            $this->entityManager->persist($mentee);
        }

        $this->entityManager->flush();

        return $mentorship;
    }

    public function removeMentee(User $lecturer, string $studentId): void
    {
        $student = $this->userRepository->find($studentId);
        if (!$student) {
            throw new NotFoundException('Student not found.');
        }

        $mentee = $this->menteeRepository->findOneBy(['student' => $student]);
        if (!$mentee) {
            throw new NotFoundException('Student is not a mentee.');
        }

        if ($mentee->getMentorship()->getLecturer()->getId() !== $lecturer->getId()) {
            throw new UnauthorizedException();
        }

        $mentorship = $mentee->getMentorship();
        $mentorship->removeMentee($mentee);
        $this->entityManager->remove($mentee);

        // If no more mentees in this mentorship record, remove the mentorship record itself
        if ($mentorship->getMentees()->isEmpty()) {
            $this->entityManager->remove($mentorship);
        }

        $this->entityManager->flush();
    }

    public function removeMenteeByStaff(string $studentId): void
    {
        $student = $this->userRepository->find($studentId);
        if (!$student) {
            throw new NotFoundException('Student not found.');
        }

        $mentee = $this->menteeRepository->findOneBy(['student' => $student]);
        if (!$mentee) {
            throw new NotFoundException('Student is not a mentee.');
        }

        $mentorship = $mentee->getMentorship();
        $mentorship->removeMentee($mentee);
        $this->entityManager->remove($mentee);

        if ($mentorship->getMentees()->isEmpty()) {
            $this->entityManager->remove($mentorship);
        }

        $this->entityManager->flush();
    }

    public function removeMentorship(User $lecturer, int $mentorshipId): void
    {
        $mentorship = $this->mentorshipRepository->find($mentorshipId);
        if (!$mentorship) {
            throw new NotFoundException('Mentorship record not found.');
        }

        if ($mentorship->getLecturer()->getId() !== $lecturer->getId()) {
            throw new UnauthorizedException();
        }

        $this->entityManager->remove($mentorship);
        $this->entityManager->flush();
    }
}
