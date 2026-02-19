<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class KpiAimUpdateDto
{
    #[Assert\NotBlank]
    #[Assert\Regex(pattern: '/^(?:[0-3](?:\.\d{1,2})?|4(?:\.0{1,2})?)$/', message: 'CGPA must be between 0.00 and 4.00.')]
    public string $cgpa;

    /** @var array{faculty:int,university:int,local:int,national:int,international:int} */
    #[Assert\NotNull]
    #[Assert\Collection(fields: [
        'faculty' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
        'university' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
        'local' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
        'national' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
        'international' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
    ], allowExtraFields: false)]
    public array $activities;

    /** @var array{faculty:int,university:int,local:int,national:int,international:int} */
    #[Assert\NotNull]
    #[Assert\Collection(fields: [
        'faculty' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
        'university' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
        'local' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
        'national' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
        'international' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
    ], allowExtraFields: false)]
    public array $competitions;

    /** @var array{professional:int,technical:int} */
    #[Assert\NotNull]
    #[Assert\Collection(fields: [
        'professional' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
        'technical' => [new Assert\Required([new Assert\Type('integer'), new Assert\GreaterThanOrEqual(0)])],
    ], allowExtraFields: false)]
    public array $certificates;
}
