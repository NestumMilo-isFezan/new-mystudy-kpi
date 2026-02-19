<?php

declare(strict_types=1);

namespace App\Serializer;

use App\Entity\Challenge;

final class ChallengeResponseSerializer
{
    public function serialize(Challenge $challenge): array
    {
        return [
            'id' => $challenge->getId(),
            'challenge' => $challenge->getChallenge(),
            'plan' => $challenge->getPlan(),
            'notes' => $challenge->getNotes(),
            'semester' => [
                'id' => $challenge->getRecord()->getId(),
                'semester' => $challenge->getRecord()->getSemester(),
                'academicYear' => $challenge->getRecord()->getAcademicYear(),
                'termString' => sprintf('%d-%s', $challenge->getRecord()->getSemester(), $challenge->getRecord()->getAcademicYearString()),
            ],
        ];
    }

    /**
     * @param Challenge[] $challenges
     */
    public function serializeCollection(array $challenges): array
    {
        $result = [];
        foreach ($challenges as $challenge) {
            $result[] = $this->serialize($challenge);
        }

        return $result;
    }
}
