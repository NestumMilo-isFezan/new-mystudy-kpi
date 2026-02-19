<?php

declare(strict_types=1);

namespace App\Enum;

enum KpiTargetSetBy: int
{
    case PERSONAL = 0;
    case LECTURER = 1;
    case FACULTY = 2;

    public function label(): string
    {
        return match ($this) {
            self::PERSONAL => 'personal',
            self::LECTURER => 'lecturer',
            self::FACULTY => 'faculty',
        };
    }
}
