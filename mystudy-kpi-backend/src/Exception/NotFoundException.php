<?php

declare(strict_types=1);

namespace App\Exception;

/**
 * Thrown when a requested resource cannot be found.
 * Maps to HTTP 404 Not Found.
 */
final class NotFoundException extends DomainException
{
    public function __construct(string $message = 'Resource not found.', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function getStatusCode(): int
    {
        return 404;
    }
}
