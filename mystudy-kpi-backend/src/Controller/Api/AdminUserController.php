<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\UserCreateDto;
use App\Service\AdminUserService;
use App\Serializer\UserResponseSerializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
#[IsGranted('ROLE_STAFF')]
class AdminUserController extends AbstractController
{
    public function __construct(
        private readonly AdminUserService $adminUserService,
        private readonly UserResponseSerializer $userResponseSerializer,
    ) {
    }

    #[Route('/users', name: 'api_admin_users_create', methods: ['POST'])]
    public function createLecturer(#[MapRequestPayload] UserCreateDto $dto): JsonResponse
    {
        $user = $this->adminUserService->createLecturer($dto);

        return $this->json([
            'message' => 'Lecturer account created.',
            'user' => $this->userResponseSerializer->serialize($user),
        ], JsonResponse::HTTP_CREATED);
    }
}
