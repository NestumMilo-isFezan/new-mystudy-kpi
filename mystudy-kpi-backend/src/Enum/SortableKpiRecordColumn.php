<?php

declare(strict_types=1);

namespace App\Enum;

enum SortableKpiRecordColumn: string
{
    case Semester = 'semester';
    case Type = 'k.type';
    case Title = 'k.title';

    public static function fromRequest(?string $column): self
    {
        return match ($column) {
            'type' => self::Type,
            'title' => self::Title,
            'semester' => self::Semester,
            default => self::Semester,
        };
    }
}
