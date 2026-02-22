<?php

declare(strict_types=1);

namespace App\Enum;

enum SortableUserColumn: string
{
    case Identifier = 'u.identifier';
    case FirstName = 'p.firstName';
    case LastName = 'p.lastName';
    case Email = 'u.email';
    case StartYear = 'i.startYear';

    public static function fromRequest(?string $value): self
    {
        if ($value === null) {
            return self::Identifier;
        }

        return match ($value) {
            'identifier' => self::Identifier,
            'firstName'  => self::FirstName,
            'lastName'   => self::LastName,
            'email'      => self::Email,
            'startYear'  => self::StartYear,
            default      => self::Identifier,
        };
    }
}
