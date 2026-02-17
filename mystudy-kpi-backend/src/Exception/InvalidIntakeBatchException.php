<?php

declare(strict_types=1);

namespace App\Exception;

class InvalidIntakeBatchException extends DomainException
{
    public function __construct(string $message = "Selected intake batch is invalid.", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
