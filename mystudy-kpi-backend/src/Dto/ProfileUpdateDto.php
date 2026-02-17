<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class ProfileUpdateDto
{
    #[Assert\Length(max: 100)]
    public ?string $firstName = null;

    #[Assert\Length(max: 100)]
    public ?string $lastName = null;

    #[Assert\Length(max: 1000)]
    public ?string $bio = null;

    #[Assert\Length(max: 150)]
    public ?string $birthPlace = null;

    #[Assert\LessThanOrEqual('today')]
    public ?\DateTimeImmutable $birthDate = null;
}
