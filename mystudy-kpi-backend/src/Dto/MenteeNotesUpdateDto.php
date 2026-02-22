<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class MenteeNotesUpdateDto
{
    #[Assert\Type('string')]
    public ?string $notes = null;
}
