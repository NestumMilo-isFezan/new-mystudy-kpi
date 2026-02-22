<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Exception\DomainException;
use App\Exception\NotFoundException;
use App\Exception\UnauthorizedException;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

#[AsEventListener(event: 'kernel.exception')]
class ExceptionListener
{
    public function __construct(
        private readonly LoggerInterface $logger,
    ) {
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $traceId = $this->resolveTraceId($event);

        if ($exception instanceof DomainException) {
            $code = match (true) {
                $exception instanceof NotFoundException => 'not_found',
                $exception instanceof UnauthorizedException => 'forbidden',
                default => 'domain_error',
            };

            $response = new JsonResponse(
                $this->buildPayload($exception->getMessage(), $code, $traceId),
                $exception->getStatusCode()
            );
            $event->setResponse($response);

            return;
        }

        if ($exception instanceof HttpExceptionInterface) {
            $message = $exception->getStatusCode() >= 500
                ? 'An unexpected server error occurred.'
                : $exception->getMessage();

            if ($exception->getStatusCode() >= 500) {
                $this->logger->error('Unhandled HTTP exception.', [
                    'traceId' => $traceId,
                    'exception' => $exception,
                ]);
            }

            $response = new JsonResponse(
                $this->buildPayload($message, 'http_error', $traceId),
                $exception->getStatusCode()
            );
            $event->setResponse($response);

            return;
        }

        $this->logger->error('Unhandled application exception.', [
            'traceId' => $traceId,
            'exception' => $exception,
        ]);

        $event->setResponse(new JsonResponse(
            $this->buildPayload('An unexpected server error occurred.', 'internal_error', $traceId),
            JsonResponse::HTTP_INTERNAL_SERVER_ERROR
        ));
    }

    /**
     * @return array{message: string, code: string, traceId: string}
     */
    private function buildPayload(string $message, string $code, string $traceId): array
    {
        return [
            'message' => $message,
            'code' => $code,
            'traceId' => $traceId,
        ];
    }

    private function resolveTraceId(ExceptionEvent $event): string
    {
        $headerTraceId = trim((string) $event->getRequest()->headers->get('X-Request-Id', ''));

        if ('' !== $headerTraceId) {
            return $headerTraceId;
        }

        return bin2hex(random_bytes(16));
    }
}
