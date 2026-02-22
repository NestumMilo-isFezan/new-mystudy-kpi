<?php

declare(strict_types=1);

namespace App\Enum;

enum SortableMentorshipColumn: string
{
    case IntakeBatchName = 'intakeBatch.name';
    case StartYear = 'intakeBatch.startYear';
    case LecturerLastName = 'lecturer.lastName';
    case MenteeCount = 'menteeCountSort';

    public static function fromRequest(?string $column): self
    {
        return match ($column) {
            'startYear' => self::StartYear,
            'lecturer' => self::LecturerLastName,
            'menteeCount' => self::MenteeCount,
            'intakeBatchName' => self::IntakeBatchName,
            default => self::IntakeBatchName,
        };
    }
}
