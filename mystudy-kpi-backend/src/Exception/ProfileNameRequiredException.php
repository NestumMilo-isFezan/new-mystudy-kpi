<?php

declare(strict_types=1);

namespace App\Exception;

final class ProfileNameRequiredException extends DomainException
{
    public function __construct(string $message = 'First name and last name are required for new profiles.', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function getStatusCode(): int
    {
        return 422;
    }
}
