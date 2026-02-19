<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class KpiRecordDto
{
    public ?int $semesterRecordId = null;

    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['activity', 'competition', 'certification'])]
    public string $type;

    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    public string $title;

    public ?string $description = null;

    #[Assert\Range(min: 0, max: 4)]
    public ?int $level = null; // 0=Faculty, 1=University, 2=Local, 3=National, 4=International

    #[Assert\Range(min: 0, max: 1)]
    public ?int $category = null; // 0=Professional, 1=Technical

    public ?array $tags = null;

    public ?string $notes = null;
}
