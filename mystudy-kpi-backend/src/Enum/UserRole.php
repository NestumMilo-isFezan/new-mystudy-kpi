<?php

declare(strict_types=1);

namespace App\Enum;

enum UserRole: int
{
    case STUDENT = 0;
    case LECTURER = 1;
    case STAFF = 2;

    public function label(): string
    {
        return match ($this) {
            self::STUDENT => 'ROLE_STUDENT',
            self::LECTURER => 'ROLE_LECTURER',
            self::STAFF => 'ROLE_STAFF',
        };
    }
}
