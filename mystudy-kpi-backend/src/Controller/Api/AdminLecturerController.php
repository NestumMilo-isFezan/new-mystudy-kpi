<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\UserCreateDto;
use App\Dto\UserUpdateDto;
use App\Service\AdminUserService;
use App\Serializer\UserResponseSerializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/lecturers')]
#[IsGranted('ROLE_STAFF')]
class AdminLecturerController extends AbstractController
{
    public function __construct(
        private readonly AdminUserService $adminUserService,
        private readonly UserResponseSerializer $userResponseSerializer,
    ) {
    }

    #[Route('', name: 'api_admin_lecturers_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $lecturers = $this->adminUserService->findAllLecturers();
        $result = [];

        foreach ($lecturers as $lecturer) {
            $result[] = $this->userResponseSerializer->serialize($lecturer);
        }

        return $this->json($result);
    }

    #[Route('', name: 'api_admin_lecturers_create', methods: ['POST'])]
    public function create(#[MapRequestPayload] UserCreateDto $dto): JsonResponse
    {
        $user = $this->adminUserService->createLecturer($dto);

        return $this->json([
            'message' => 'Lecturer account created.',
            'user' => $this->userResponseSerializer->serialize($user),
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_admin_lecturers_update', methods: ['PATCH'])]
    public function update(string $id, #[MapRequestPayload] UserUpdateDto $dto): JsonResponse
    {
        try {
            $user = $this->adminUserService->updateLecturer($id, $dto);

            return $this->json([
                'message' => 'Lecturer account updated.',
                'user' => $this->userResponseSerializer->serialize($user),
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('/{id}', name: 'api_admin_lecturers_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        try {
            $this->adminUserService->deleteLecturer($id);
            return $this->json([
                'message' => 'Lecturer account deleted.',
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], JsonResponse::HTTP_NOT_FOUND);
        }
    }
}
