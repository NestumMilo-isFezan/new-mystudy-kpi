<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\IntakeBatchRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class AuthController extends AbstractController
{
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserRepository $userRepository,
        IntakeBatchRepository $intakeBatchRepository,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $payload = $this->decodePayload($request);
        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        if (!isset($payload['identifier'], $payload['email'], $payload['password'], $payload['intakeBatchId'])) {
            return $this->json(['message' => 'Missing required fields.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if ($userRepository->findOneBy(['identifier' => strtoupper(trim((string) $payload['identifier']))])) {
            return $this->json(['message' => 'Identifier is already used.'], JsonResponse::HTTP_CONFLICT);
        }

        if ($userRepository->findOneBy(['email' => strtolower(trim((string) $payload['email']))])) {
            return $this->json(['message' => 'Email is already used.'], JsonResponse::HTTP_CONFLICT);
        }

        $intakeBatch = $intakeBatchRepository->find((int) $payload['intakeBatchId']);
        if (!$intakeBatch || !$intakeBatch->isActive()) {
            return $this->json(['message' => 'Selected intake batch is invalid.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = (new User())
            ->setIdentifier((string) $payload['identifier'])
            ->setEmail((string) $payload['email'])
            ->setRoleValue(User::ROLE_STUDENT_VALUE)
            ->setIntakeBatch($intakeBatch);

        $hashedPassword = $passwordHasher->hashPassword($user, (string) $payload['password']);
        $user->setPassword($hashedPassword);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'message' => 'Student account registered.',
            'user' => [
                'id' => $user->getId(),
                'identifier' => $user->getIdentifier(),
                'email' => $user->getEmail(),
                'role' => $user->getRoleValue(),
            ],
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $tokenManager,
    ): JsonResponse {
        $payload = $this->decodePayload($request);
        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        if (!isset($payload['identifier'], $payload['password'])) {
            return $this->json(['message' => 'Missing credentials.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $identifier = strtoupper(trim((string) $payload['identifier']));
        $user = $userRepository->findOneBy(['identifier' => $identifier]);

        if (!$user || !$passwordHasher->isPasswordValid($user, (string) $payload['password'])) {
            return $this->json(['message' => 'Invalid credentials.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $token = $tokenManager->create($user);
        $response = $this->json([
            'message' => 'Login successful.',
            'user' => [
                'id' => $user->getId(),
                'identifier' => $user->getIdentifier(),
                'email' => $user->getEmail(),
                'role' => $user->getRoleValue(),
            ],
        ]);

        $response->headers->setCookie(
            Cookie::create('AUTH_TOKEN')
                ->withValue($token)
                ->withHttpOnly(true)
                ->withPath('/')
                ->withSameSite(Cookie::SAMESITE_LAX)
                ->withSecure($request->isSecure())
                ->withExpires(new \DateTimeImmutable('+8 hours'))
        );

        return $response;
    }

    #[Route('/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        $response = $this->json(['message' => 'Logout successful.']);
        $response->headers->clearCookie('AUTH_TOKEN', '/');

        return $response;
    }

    /** @return array<string, mixed>|JsonResponse */
    private function decodePayload(Request $request): array|JsonResponse
    {
        try {
            return $request->toArray();
        } catch (\JsonException) {
            return $this->json(['message' => 'Invalid JSON body.'], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
}
