<?php

declare(strict_types=1);

namespace App\Enum;

enum SortableIntakeColumn: string
{
    case Name = 'b.name';
    case StartYear = 'b.startYear';
    case IsActive = 'b.isActive';

    public static function fromRequest(?string $column): self
    {
        return match ($column) {
            'startYear' => self::StartYear,
            'isActive' => self::IsActive,
            'name' => self::Name,
            default => self::Name,
        };
    }
}
