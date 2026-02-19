<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class AccountUpdateDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string $intakeBatchId,
    ) {
    }
}
