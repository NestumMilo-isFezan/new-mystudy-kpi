<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\User;
use App\Entity\UserSession;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

final readonly class JWTCreatedListener
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private RequestStack $requestStack,
    ) {
    }

    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        try {
            $user = $event->getUser();
            if (!$user instanceof User) {
                return;
            }

            $request = $this->requestStack->getCurrentRequest();
            $payload = $event->getData();

            $session = new UserSession();
            $session->setUser($user);
            $session->setIpAddress($request?->getClientIp());
            $session->setUserAgent($request?->headers->get('User-Agent'));
            
            // 30 days expiration
            $session->setExpiresAt(new \DateTimeImmutable('+30 days'));

            $this->entityManager->persist($session);
            $this->entityManager->flush();

            // Add JTI to the payload
            $payload['jti'] = $session->getId();

            $event->setData($payload);
        } catch (\Exception) {
            // Silently fail - if session tracking fails, we still want to allow login
            // but the jti will be missing, so we'll need to handle that gracefully
        }
    }
}
