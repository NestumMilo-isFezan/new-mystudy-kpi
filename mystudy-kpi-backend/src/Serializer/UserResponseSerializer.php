<?php

declare(strict_types=1);

namespace App\Serializer;

use App\Entity\User;

final class UserResponseSerializer
{
    public function serialize(User $user): array
    {
        return [
            'id' => $user->getId(),
            'identifier' => $user->getIdentifier(),
            'email' => $user->getEmail(),
            'role' => $user->getRole()->value,
        ];
    }
}
