<?php

declare(strict_types=1);

namespace App\Enum;

enum SortableAcademicColumn: string
{
    case AcademicYear = 's.academicYear';
    case Semester = 's.semester';
    case Gpa = 'c.gpa';

    public static function fromRequest(?string $column): self
    {
        return match ($column) {
            'semester' => self::Semester,
            'gpa' => self::Gpa,
            'academicYear' => self::AcademicYear,
            default => self::AcademicYear,
        };
    }
}
