<?php

declare(strict_types=1);

namespace App\Enum;

enum SortableChallengeColumn: string
{
    case Semester = 'semester';
    case Challenge = 'c.challenge';

    public static function fromRequest(?string $column): self
    {
        return match ($column) {
            'challenge' => self::Challenge,
            'semester' => self::Semester,
            default => self::Semester,
        };
    }
}
