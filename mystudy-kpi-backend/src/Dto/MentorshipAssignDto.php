<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class MentorshipAssignDto
{
    #[Assert\NotBlank]
    public int $batchId;

    /**
     * @var string[]
     */
    #[Assert\NotBlank]
    #[Assert\Count(min: 1)]
    #[Assert\All([new Assert\NotBlank(), new Assert\Uuid()])]
    public array $studentIds;
}
