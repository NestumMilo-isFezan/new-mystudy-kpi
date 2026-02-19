<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Repository\UserSessionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

final readonly class JWTDecodedListener
{
    public function __construct(
        private UserSessionRepository $userSessionRepository,
        private EntityManagerInterface $entityManager,
        private RequestStack $requestStack,
    ) {
    }

    public function onJWTDecoded(JWTDecodedEvent $event): void
    {
        $payload = $event->getPayload();

        if (!isset($payload['jti'])) {
            $event->markAsInvalid();
            return;
        }

        $session = $this->userSessionRepository->find($payload['jti']);

        if (!$session || !$session->isValid()) {
            $event->markAsInvalid();
            return;
        }

        // Store payload in request attributes for later use in controllers
        $request = $this->requestStack->getCurrentRequest();
        $request?->attributes->set('jwt_payload', $payload);

        // Update last active time
        $session->setLastActiveAt(new \DateTimeImmutable());
        $this->entityManager->flush();
    }
}
