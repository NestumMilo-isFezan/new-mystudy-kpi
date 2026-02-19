<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CgpaRecordDto
{
    #[Assert\Type(type: 'numeric')]
    #[Assert\Range(min: 0, max: 4)]
    public ?string $gpa = null;
}
