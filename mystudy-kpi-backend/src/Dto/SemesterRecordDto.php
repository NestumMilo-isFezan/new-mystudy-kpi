<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class SemesterRecordDto
{
    #[Assert\NotBlank]
    #[Assert\Range(min: 1, max: 10)]
    public int $semester;

    #[Assert\NotBlank]
    #[Assert\Range(min: 2000, max: 2100)]
    public int $academicYear;

    #[Assert\Type(type: 'numeric')]
    #[Assert\Range(min: 0, max: 4)]
    public ?string $gpa = null;
}
