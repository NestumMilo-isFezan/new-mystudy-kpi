<?php

declare(strict_types=1);

namespace App\Exception;

/**
 * Thrown when an unrecognised role value is encountered.
 * Maps to HTTP 400 Bad Request.
 */
final class InvalidRoleException extends DomainException
{
    public function __construct(string $message = 'Unknown role value.', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function getStatusCode(): int
    {
        return 400;
    }
}
