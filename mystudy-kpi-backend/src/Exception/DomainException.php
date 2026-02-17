<?php

declare(strict_types=1);

namespace App\Exception;

class DomainException extends \Exception
{
    public function getStatusCode(): int
    {
        return 400;
    }
}
