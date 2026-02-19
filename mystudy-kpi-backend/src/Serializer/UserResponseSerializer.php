<?php

declare(strict_types=1);

namespace App\Serializer;

use App\Entity\User;

final class UserResponseSerializer
{
    public function serialize(User $user): array
    {
        $intake = null;
        if ($user->getIntakeBatch()) {
            $batch = $user->getIntakeBatch();
            $intake = [
                'id' => $batch->getId(),
                'name' => $batch->getName(),
                'startYear' => $batch->getStartYear(),
            ];
        }

        return [
            'id' => $user->getId(),
            'identifier' => $user->getIdentifier(),
            'email' => $user->getEmail(),
            'firstName' => $user->getProfile()?->getFirstName(),
            'lastName' => $user->getProfile()?->getLastName(),
            'role' => $user->getRole()->value,
            'intake' => $intake,
        ];
    }
}
