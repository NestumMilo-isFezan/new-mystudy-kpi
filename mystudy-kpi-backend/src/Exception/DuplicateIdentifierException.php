<?php

declare(strict_types=1);

namespace App\Exception;

class DuplicateIdentifierException extends DomainException
{
    public function __construct(string $message = "Identifier is already used.", int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
