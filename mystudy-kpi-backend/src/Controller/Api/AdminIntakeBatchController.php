<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\IntakeBatchCreateDto;
use App\Service\IntakeBatchService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
#[IsGranted('ROLE_STAFF')]
class AdminIntakeBatchController extends AbstractController
{
    public function __construct(
        private readonly IntakeBatchService $intakeBatchService,
    ) {
    }

    #[Route('/intake-batches', name: 'api_admin_intake_batches_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $batches = $this->intakeBatchService->findAllBatches();
        $result = [];

        foreach ($batches as $batch) {
            $result[] = [
                'id' => $batch->getId(),
                'name' => $batch->getName(),
                'startYear' => $batch->getStartYear(),
                'isActive' => $batch->isActive(),
            ];
        }

        return $this->json($result);
    }

    #[Route('/intake-batches', name: 'api_admin_intake_batches_create', methods: ['POST'])]
    public function create(#[MapRequestPayload] IntakeBatchCreateDto $dto): JsonResponse
    {
        $batch = $this->intakeBatchService->createBatch($dto->startYear);

        return $this->json([
            'message' => 'Intake batch created.',
            'batch' => [
                'id' => $batch->getId(),
                'name' => $batch->getName(),
                'startYear' => $batch->getStartYear(),
                'isActive' => $batch->isActive(),
            ],
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/intake-batches/{id}', name: 'api_admin_intake_batches_update', methods: ['PATCH'])]
    public function update(int $id, #[MapRequestPayload] IntakeBatchCreateDto $dto): JsonResponse
    {
        $batch = $this->intakeBatchService->updateBatch($id, $dto->startYear);

        return $this->json([
            'message' => 'Intake batch updated.',
            'batch' => [
                'id' => $batch->getId(),
                'name' => $batch->getName(),
                'startYear' => $batch->getStartYear(),
                'isActive' => $batch->isActive(),
            ],
        ]);
    }

    #[Route('/intake-batches/{id}/toggle', name: 'api_admin_intake_batches_toggle', methods: ['PATCH'])]
    public function toggle(int $id): JsonResponse
    {
        $batch = $this->intakeBatchService->toggleBatchStatus($id);

        return $this->json([
            'message' => 'Intake batch status updated.',
            'batch' => [
                'id' => $batch->getId(),
                'name' => $batch->getName(),
                'startYear' => $batch->getStartYear(),
                'isActive' => $batch->isActive(),
            ],
        ]);
    }

    #[Route('/intake-batches/{id}', name: 'api_admin_intake_batches_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $this->intakeBatchService->deleteBatch($id);

        return $this->json([
            'message' => 'Intake batch deleted.',
        ]);
    }
}
