<?php

namespace App\Security;

use App\Entity\User;

class RoleMapper
{
    public function toSymfonyRole(int $roleValue): string
    {
        if (!\in_array($roleValue, [User::ROLE_STUDENT_VALUE, User::ROLE_LECTURER_VALUE, User::ROLE_STAFF_VALUE], true)) {
            throw new \InvalidArgumentException('Unknown role value.');
        }

        return User::roleValueToRoleName($roleValue);
    }
}
