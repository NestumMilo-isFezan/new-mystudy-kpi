<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\KpiRecordDto;
use App\Entity\User;
use App\Serializer\KpiRecordResponseSerializer;
use App\Service\KpiRecordService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/student/kpi-records')]
#[IsGranted('ROLE_STUDENT')]
class StudentKpiRecordController extends AbstractController
{
    public function __construct(
        private readonly KpiRecordService $kpiRecordService,
        private readonly KpiRecordResponseSerializer $serializer,
    ) {
    }

    #[Route('', name: 'api_student_kpi_records_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $records = $this->kpiRecordService->listRecords($user);

        return $this->json($this->serializer->serializeCollection($records));
    }

    #[Route('', name: 'api_student_kpi_records_create', methods: ['POST'])]
    public function create(#[MapRequestPayload] KpiRecordDto $dto): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        try {
            $record = $this->kpiRecordService->createRecord($user, $dto);

            return $this->json([
                'message' => 'KPI record created.',
                'record' => $this->serializer->serialize($record),
            ], JsonResponse::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'api_student_kpi_records_update', methods: ['PATCH'])]
    public function update(string $id, #[MapRequestPayload] KpiRecordDto $dto): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        try {
            $record = $this->kpiRecordService->updateRecord($user, (int) $id, $dto);

            return $this->json([
                'message' => 'KPI record updated.',
                'record' => $this->serializer->serialize($record),
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('/{id}', name: 'api_student_kpi_records_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        try {
            $this->kpiRecordService->deleteRecord($user, (int) $id);

            return $this->json(['message' => 'KPI record deleted.']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }
}
