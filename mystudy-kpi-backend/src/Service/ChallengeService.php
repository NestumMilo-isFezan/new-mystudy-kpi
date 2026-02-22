<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\ChallengeDto;
use App\Entity\Challenge;
use App\Entity\User;
use App\Enum\SortableChallengeColumn;
use App\Exception\NotFoundException;
use App\Repository\ChallengeRepository;
use App\Repository\SemesterRecordRepository;
use Doctrine\ORM\EntityManagerInterface;

class ChallengeService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ChallengeRepository $challengeRepository,
        private readonly SemesterRecordRepository $semesterRecordRepository,
    ) {
    }

    /**
     * @return Challenge[]
     */
    public function listChallenges(User $student): array
    {
        return $this->challengeRepository->findByStudent($student);
    }

    /**
     * @return array{items: Challenge[], total: int}
     */
    public function listChallengesPage(
        User $student,
        int $page,
        int $limit,
        SortableChallengeColumn $sortBy,
        string $sortDir,
        ?int $semester = null,
    ): array {
        return $this->challengeRepository->findByStudentPaginated(
            $student,
            $page,
            $limit,
            $sortBy,
            $sortDir,
            $semester,
        );
    }

    public function createChallenge(User $student, ChallengeDto $dto): Challenge
    {
        $record = $this->semesterRecordRepository->findOneBy([
            'id' => $dto->semesterRecordId,
            'student' => $student,
        ]);

        if (null === $record) {
            throw new NotFoundException('Semester record not found.');
        }

        $challenge = (new Challenge())
            ->setRecord($record)
            ->setChallenge($dto->challenge)
            ->setPlan($dto->plan)
            ->setNotes($dto->notes);

        $this->entityManager->persist($challenge);
        $this->entityManager->flush();

        return $challenge;
    }

    public function updateChallenge(User $student, int $id, ChallengeDto $dto): Challenge
    {
        $challenge = $this->challengeRepository->find($id);

        if (null === $challenge || $challenge->getRecord()->getStudent() !== $student) {
            throw new NotFoundException('Challenge not found.');
        }

        $record = $this->semesterRecordRepository->findOneBy([
            'id' => $dto->semesterRecordId,
            'student' => $student,
        ]);

        if (null === $record) {
            throw new NotFoundException('Semester record not found.');
        }

        $challenge
            ->setRecord($record)
            ->setChallenge($dto->challenge)
            ->setPlan($dto->plan)
            ->setNotes($dto->notes);

        $this->entityManager->flush();

        return $challenge;
    }

    public function deleteChallenge(User $student, int $id): void
    {
        $challenge = $this->challengeRepository->find($id);

        if (null === $challenge || $challenge->getRecord()->getStudent() !== $student) {
            throw new NotFoundException('Challenge not found.');
        }

        $this->entityManager->remove($challenge);
        $this->entityManager->flush();
    }
}
