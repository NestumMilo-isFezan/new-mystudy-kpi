<?php

declare(strict_types=1);

namespace App\Security;

use App\Enum\UserRole;

class RoleMapper
{
    public function toSymfonyRole(int $roleValue): string
    {
        $role = UserRole::tryFrom($roleValue);

        if (null === $role) {
            throw new \InvalidArgumentException('Unknown role value.');
        }

        return $role->label();
    }
}
