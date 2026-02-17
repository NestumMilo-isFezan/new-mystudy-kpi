<?php

declare(strict_types=1);

namespace App\Controller\Api;

use JsonException;
use App\Dto\RegistrationDto;
use App\Service\AuthService;
use App\Service\CookieService;
use App\Serializer\UserResponseSerializer;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class AuthController extends AbstractController
{
    public function __construct(
        private readonly AuthService $authService,
        private readonly CookieService $cookieService,
        private readonly UserResponseSerializer $userResponseSerializer,
    ) {
    }

    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(#[MapRequestPayload] RegistrationDto $registrationDto): JsonResponse
    {
        $user = $this->authService->register($registrationDto);

        return $this->json([
            'message' => 'Student account registered.',
            'user' => $this->userResponseSerializer->serialize($user),
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        JWTTokenManagerInterface $tokenManager,
    ): JsonResponse {
        try {
            $data = $request->toArray();
        } catch (JsonException) {
            throw new BadRequestHttpException('Invalid JSON payload.');
        }

        $login = (string) ($data['identifier'] ?? $data['email'] ?? '');
        $password = (string) ($data['password'] ?? '');
        $user = $this->authService->authenticate($login, $password);

        $token = $tokenManager->create($user);
        $response = $this->json([
            'message' => 'Login successful.',
            'user' => $this->userResponseSerializer->serialize($user),
        ]);

        $response->headers->setCookie($this->cookieService->createAuthCookie($token, $request));

        return $response;
    }

    #[Route('/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        $response = $this->json(['message' => 'Logout successful.']);
        $response->headers->setCookie($this->cookieService->clearAuthCookie());

        return $response;
    }
}
