<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Exception\DomainException;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

#[AsEventListener(event: 'kernel.exception')]
class ExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        if ($exception instanceof DomainException) {
            $response = new JsonResponse(
                ['message' => $exception->getMessage()],
                $exception->getStatusCode()
            );
            $event->setResponse($response);

            return;
        }

        if ($exception instanceof HttpExceptionInterface) {
            $message = $exception->getStatusCode() >= 500
                ? 'An unexpected server error occurred.'
                : $exception->getMessage();

            $response = new JsonResponse(
                ['message' => $message],
                $exception->getStatusCode()
            );
            $event->setResponse($response);

            return;
        }
    }
}
