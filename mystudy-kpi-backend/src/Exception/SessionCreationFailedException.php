<?php

declare(strict_types=1);

namespace App\Exception;

final class SessionCreationFailedException extends DomainException
{
    public function __construct(
        string $message = 'Unable to establish your session right now. Please try again.',
        int $code = 0,
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }

    public function getStatusCode(): int
    {
        return 503;
    }
}
