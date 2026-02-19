<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class IntakeBatchCreateDto
{
    #[Assert\NotNull]
    #[Assert\Range(min: 2000, max: 2100)]
    public int $startYear;
}
