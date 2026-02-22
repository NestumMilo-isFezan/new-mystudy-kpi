<?php

declare(strict_types=1);

namespace App\Security;

use App\Enum\UserRole;
use App\Exception\InvalidRoleException;

class RoleMapper
{
    public function toSymfonyRole(int $roleValue): string
    {
        $role = UserRole::tryFrom($roleValue);

        if (null === $role) {
            throw new InvalidRoleException();
        }

        return $role->label();
    }
}
