<?php

declare(strict_types=1);

namespace App\Exception;

final class MissingCredentialsException extends DomainException
{
    public function __construct(string $message = 'Missing credentials.', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function getStatusCode(): int
    {
        return 400;
    }
}
