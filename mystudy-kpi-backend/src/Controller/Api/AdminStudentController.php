<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\UserCreateDto;
use App\Dto\UserUpdateDto;
use App\Service\AdminUserService;
use App\Service\PaginationService;
use App\Serializer\UserResponseSerializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/students')]
#[IsGranted('ROLE_STAFF')]
class AdminStudentController extends AbstractController
{
    public function __construct(
        private readonly AdminUserService $adminUserService,
        private readonly PaginationService $paginationService,
        private readonly UserResponseSerializer $userResponseSerializer,
    ) {
    }

    #[Route('', name: 'api_admin_students_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $pagination = $this->paginationService->resolve($request);
        $sort = $this->paginationService->resolveUserSort($request);
        $startYearRaw = $this->paginationService->resolveFilter($request, 'startYear');
        $startYear = $startYearRaw !== null ? (int) $startYearRaw : null;

        $resultPage = $this->adminUserService->findStudentsPage(
            $pagination['page'],
            $pagination['limit'],
            $sort['sortBy'],
            $sort['sortDir'],
            $startYear,
        );

        $result = [];

        foreach ($resultPage['items'] as $student) {
            $result[] = $this->userResponseSerializer->serialize($student);
        }

        return $this->json([
            'items' => $result,
            'pagination' => $this->paginationService->metadata(
                $pagination['page'],
                $pagination['limit'],
                $resultPage['total']
            ),
        ]);
    }

    #[Route('', name: 'api_admin_students_create', methods: ['POST'])]
    public function create(#[MapRequestPayload] UserCreateDto $dto): JsonResponse
    {
        if ($dto->intakeBatchId === null) {
            return $this->json(['message' => 'Intake batch is required for students.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->adminUserService->createStudent($dto, $dto->intakeBatchId);

        return $this->json([
            'message' => 'Student account created.',
            'user' => $this->userResponseSerializer->serialize($user),
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_admin_students_update', methods: ['PATCH'])]
    public function update(string $id, #[MapRequestPayload] UserUpdateDto $dto): JsonResponse
    {
        try {
            $user = $this->adminUserService->updateStudent($id, $dto, $dto->intakeBatchId);

            return $this->json([
                'message' => 'Student account updated.',
                'user' => $this->userResponseSerializer->serialize($user),
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('/{id}', name: 'api_admin_students_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        try {
            $this->adminUserService->deleteStudent($id);
            return $this->json([
                'message' => 'Student account deleted.',
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], JsonResponse::HTTP_NOT_FOUND);
        }
    }
}
