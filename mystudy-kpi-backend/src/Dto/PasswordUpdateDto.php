<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class PasswordUpdateDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string $currentPassword,

        #[Assert\NotBlank]
        #[Assert\Length(min: 8)]
        public string $newPassword,

        #[Assert\NotBlank]
        #[Assert\EqualTo(propertyPath: 'newPassword', message: 'Passwords do not match.')]
        public string $confirmPassword,
    ) {
    }
}
