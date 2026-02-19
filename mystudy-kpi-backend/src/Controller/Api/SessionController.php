<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\UserSession;
use App\Repository\UserSessionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/sessions')]
#[IsGranted('IS_AUTHENTICATED_FULLY')]
final class SessionController extends AbstractController
{
    public function __construct(
        private readonly UserSessionRepository $userSessionRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('', name: 'api_sessions_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $sessions = $this->userSessionRepository->findBy(['user' => $user], ['lastActiveAt' => 'DESC']);

        // Use request attributes which are populated by LexikJWT in the actual app
        $payload = $request->attributes->get('jwt_payload') ?? [];
        $currentJti = $payload['jti'] ?? null;

        $data = array_map(fn(UserSession $session) => [
            'id' => $session->getId(),
            'ip_address' => $session->getIpAddress(),
            'user_agent' => $session->getUserAgent(),
            'created_at' => $session->getCreatedAt()->format(\DateTimeInterface::ATOM),
            'last_active_at' => $session->getLastActiveAt()?->format(\DateTimeInterface::ATOM),
            'expires_at' => $session->getExpiresAt()->format(\DateTimeInterface::ATOM),
            'is_current' => $session->getId() === $currentJti,
        ], $sessions);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'api_session_revoke', methods: ['DELETE'])]
    public function revoke(string $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $session = $this->userSessionRepository->findOneBy(['id' => $id, 'user' => $user]);

        if (!$session) {
            return $this->json(['message' => 'Session not found.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($session);
        $this->entityManager->flush();

        return $this->json(['message' => 'Session revoked.']);
    }

    #[Route('/revoke-all-others', name: 'api_sessions_revoke_others', methods: ['POST'])]
    public function revokeOthers(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $payload = $request->attributes->get('jwt_payload') ?? [];
        $currentJti = $payload['jti'] ?? null;

        if (!$currentJti) {
            return $this->json(['message' => 'Current session not found.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $sessions = $this->userSessionRepository->findBy(['user' => $user]);
        
        foreach ($sessions as $session) {
            if ($session->getId() !== $currentJti) {
                $this->entityManager->remove($session);
            }
        }

        $this->entityManager->flush();

        return $this->json(['message' => 'Other sessions revoked.']);
    }
}
