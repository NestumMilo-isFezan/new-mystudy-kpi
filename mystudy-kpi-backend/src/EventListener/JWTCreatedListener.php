<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\User;
use App\Entity\UserSession;
use App\Exception\SessionCreationFailedException;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

final readonly class JWTCreatedListener
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private RequestStack $requestStack,
        private LoggerInterface $logger,
    ) {
    }

    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();
        if (!$user instanceof User) {
            return;
        }

        try {
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
        } catch (\Throwable $exception) {
            $this->logger->error('Failed to create JWT session record.', [
                'exception' => $exception,
                'userId' => $user->getId(),
            ]);

            throw new SessionCreationFailedException(previous: $exception);
        }
    }
}
