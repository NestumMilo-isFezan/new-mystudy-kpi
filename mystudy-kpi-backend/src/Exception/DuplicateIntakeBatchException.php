<?php

declare(strict_types=1);

namespace App\Exception;

final class DuplicateIntakeBatchException extends DomainException
{
    public function __construct(string $message = 'Intake batch for this start year already exists.', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function getStatusCode(): int
    {
        return 409;
    }
}
