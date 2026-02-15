<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
#[IsGranted(User::ROLE_STAFF)]
class AdminUserController extends AbstractController
{
    #[Route('/users', name: 'api_admin_users_create', methods: ['POST'])]
    public function createLecturer(
        Request $request,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        try {
            $payload = $request->toArray();
        } catch (\JsonException) {
            return $this->json(['message' => 'Invalid JSON body.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (!isset($payload['identifier'], $payload['email'], $payload['password'])) {
            return $this->json(['message' => 'Missing required fields.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if ($userRepository->findOneBy(['identifier' => strtoupper(trim((string) $payload['identifier']))])) {
            return $this->json(['message' => 'Identifier is already used.'], JsonResponse::HTTP_CONFLICT);
        }

        if ($userRepository->findOneBy(['email' => strtolower(trim((string) $payload['email']))])) {
            return $this->json(['message' => 'Email is already used.'], JsonResponse::HTTP_CONFLICT);
        }

        $user = (new User())
            ->setIdentifier((string) $payload['identifier'])
            ->setEmail((string) $payload['email'])
            ->setRoleValue(User::ROLE_LECTURER_VALUE);

        $user->setPassword($passwordHasher->hashPassword($user, (string) $payload['password']));

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'message' => 'Lecturer account created.',
            'user' => [
                'id' => $user->getId(),
                'identifier' => $user->getIdentifier(),
                'email' => $user->getEmail(),
                'role' => $user->getRoleValue(),
            ],
        ], JsonResponse::HTTP_CREATED);
    }
}
