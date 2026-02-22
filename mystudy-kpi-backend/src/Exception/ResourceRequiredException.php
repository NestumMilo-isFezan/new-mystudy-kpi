<?php

declare(strict_types=1);

namespace App\Exception;

/**
 * Thrown when a required resource or field is missing from the request context.
 * Maps to HTTP 422 Unprocessable Entity.
 */
final class ResourceRequiredException extends DomainException
{
    public function __construct(string $message = 'A required resource is missing.', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function getStatusCode(): int
    {
        return 422;
    }
}
