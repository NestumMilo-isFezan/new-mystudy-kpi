<?php

declare(strict_types=1);

namespace App\Serializer;

use App\Entity\Mentorship;
use App\Serializer\UserResponseSerializer;

final class MentorshipResponseSerializer
{
    public function __construct(private readonly UserResponseSerializer $userSerializer)
    {
    }

    public function serialize(Mentorship $mentorship, ?array $mentees = null, ?int $menteeCount = null): array
    {
        $batch = $mentorship->getIntakeBatch();
        $lecturer = $mentorship->getLecturer();
        $isIndexPreview = $mentees !== null;

        // If mentees are provided (e.g., pre-fetched top 5 for index), use them
        // Otherwise, fetch from the collection and slice to 5 (legacy/fallback)
        if ($isIndexPreview) {
            $menteeDtos = $this->mapMenteeEntitiesToDtos($mentees);
            $count = $menteeCount ?? count($menteeDtos);
        } else {
            $allMentees = $this->getMentees($mentorship);
            $menteeDtos = array_slice($this->mapMenteeEntitiesToDtos($allMentees), 0, 5);
            $count = count($allMentees);
        }

        return [
            'id' => $mentorship->getId(),
            'intakeBatch' => [
                'id' => $batch->getId(),
                'name' => $batch->getName(),
                'startYear' => $batch->getStartYear(),
            ],
            'lecturer' => $this->userSerializer->serialize($lecturer),
            'menteeCount' => $count,
            'mentees' => $menteeDtos,
        ];
    }

    public function serializeFull(Mentorship $mentorship): array
    {
        $allMentees = $this->getMentees($mentorship);
        $batch = $mentorship->getIntakeBatch();
        $lecturer = $mentorship->getLecturer();

        return [
            'id' => $mentorship->getId(),
            'intakeBatch' => [
                'id' => $batch->getId(),
                'name' => $batch->getName(),
                'startYear' => $batch->getStartYear(),
            ],
            'lecturer' => $this->userSerializer->serialize($lecturer),
            'menteeCount' => count($allMentees),
            'mentees' => $this->mapMenteeEntitiesToDtos($allMentees),
        ];
    }

    /**
     * @param User[] $students
     */
    private function mapMenteeEntitiesToDtos(array $students): array
    {
        $dtos = [];
        foreach ($students as $student) {
            $dtos[] = $this->userSerializer->serialize($student);
        }
        return $dtos;
    }

    private function getMentees(Mentorship $mentorship): array
    {
        $students = [];
        foreach ($mentorship->getMentees() as $mentee) {
            $students[] = $mentee->getStudent();
        }
        return $students;
    }
}
