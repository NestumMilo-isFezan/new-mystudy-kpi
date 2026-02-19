<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UserCreateDto
{
    #[Assert\NotBlank]
    #[Assert\Length(max: 64)]
    public string $identifier;

    #[Assert\NotBlank]
    #[Assert\Email]
    #[Assert\Length(max: 180)]
    public string $email;

    #[Assert\NotBlank]
    #[Assert\Length(max: 100)]
    public string $firstName;

    #[Assert\NotBlank]
    #[Assert\Length(max: 100)]
    public string $lastName;

    #[Assert\Type('integer')]
    public ?int $intakeBatchId = null;

    #[Assert\NotBlank]
    #[Assert\Length(min: 8)]
    public string $password;
}
