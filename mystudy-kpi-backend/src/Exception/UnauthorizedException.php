<?php

declare(strict_types=1);

namespace App\Exception;

/**
 * Thrown when the current user is not permitted to perform an action.
 * Maps to HTTP 403 Forbidden.
 */
final class UnauthorizedException extends DomainException
{
    public function __construct(string $message = 'You are not authorized to perform this action.', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function getStatusCode(): int
    {
        return 403;
    }
}
