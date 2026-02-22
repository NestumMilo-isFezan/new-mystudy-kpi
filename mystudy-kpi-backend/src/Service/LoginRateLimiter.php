<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Contracts\Cache\CacheInterface;

class LoginRateLimiter
{
    private const int WINDOW_SECONDS = 900;
    private const int MAX_ATTEMPTS = 5;

    public function __construct(
        #[Autowire(service: 'cache.app')]
        private readonly CacheInterface $cache,
    ) {
    }

    public function assertAllowed(Request $request, string $identifier): void
    {
        $state = $this->readState($this->buildKey($request, $identifier));

        if ($state['count'] < self::MAX_ATTEMPTS) {
            return;
        }

        $retryAfter = max($state['expiresAt'] - time(), 1);
        throw new TooManyRequestsHttpException($retryAfter, 'Too many login attempts. Please try again later.');
    }

    public function registerFailure(Request $request, string $identifier): void
    {
        $key = $this->buildKey($request, $identifier);
        $state = $this->readState($key);

        $this->cache->delete($key);
        $this->cache->get($key, function ($item) use ($state) {
            $item->expiresAfter(self::WINDOW_SECONDS);

            return [
                'count' => $state['count'] + 1,
                'expiresAt' => time() + self::WINDOW_SECONDS,
            ];
        });
    }

    public function clear(Request $request, string $identifier): void
    {
        $this->cache->delete($this->buildKey($request, $identifier));
    }

    private function buildKey(Request $request, string $identifier): string
    {
        $normalizedIdentifier = strtolower(trim($identifier));
        $ip = (string) ($request->getClientIp() ?? 'unknown');

        return sprintf('login_rate_limiter:%s:%s', sha1($ip), sha1($normalizedIdentifier));
    }

    /**
     * @return array{count: int, expiresAt: int}
     */
    private function readState(string $key): array
    {
        $value = $this->cache->get($key, function ($item) {
            $item->expiresAfter(self::WINDOW_SECONDS);

            return [
                'count' => 0,
                'expiresAt' => time() + self::WINDOW_SECONDS,
            ];
        });

        if (!is_array($value)) {
            return [
                'count' => 0,
                'expiresAt' => time() + self::WINDOW_SECONDS,
            ];
        }

        $count = isset($value['count']) ? (int) $value['count'] : 0;
        $expiresAt = isset($value['expiresAt']) ? (int) $value['expiresAt'] : (time() + self::WINDOW_SECONDS);

        return [
            'count' => max(0, $count),
            'expiresAt' => max($expiresAt, time() + 1),
        ];
    }
}
