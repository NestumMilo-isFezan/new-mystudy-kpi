<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;

class CookieService
{
    public const string AUTH_TOKEN_COOKIE = 'AUTH_TOKEN';

    public function __construct(
        #[Autowire('%kernel.environment%')]
        private readonly string $appEnvironment,
    ) {
    }

    public function createAuthCookie(string $token, Request $request): Cookie
    {
        $isSecure = 'prod' === $this->appEnvironment || $request->isSecure();

        return Cookie::create(self::AUTH_TOKEN_COOKIE)
            ->withValue($token)
            ->withHttpOnly(true)
            ->withPath('/')
            ->withSameSite(Cookie::SAMESITE_LAX)
            ->withSecure($isSecure)
            ->withExpires(new \DateTimeImmutable('+30 days'));
    }

    public function clearAuthCookie(): Cookie
    {
        $isSecure = 'prod' === $this->appEnvironment;

        return Cookie::create(self::AUTH_TOKEN_COOKIE)
            ->withValue('')
            ->withHttpOnly(true)
            ->withPath('/')
            ->withSameSite(Cookie::SAMESITE_LAX)
            ->withSecure($isSecure)
            ->withExpires(new \DateTimeImmutable('-1 hour'));
    }
}
