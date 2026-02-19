<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class ChallengeDto
{
    #[Assert\NotBlank]
    public int $semesterRecordId;

    #[Assert\NotBlank]
    public string $challenge;

    #[Assert\NotBlank]
    public string $plan;

    public ?string $notes = null;
}
