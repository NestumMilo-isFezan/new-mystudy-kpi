<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\CgpaRecordDto;
use App\Dto\SemesterRecordDto;
use App\Entity\User;
use App\Serializer\AcademicResponseSerializer;
use App\Service\AcademicService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/student/academics')]
#[IsGranted('ROLE_STUDENT')]
class StudentAcademicController extends AbstractController
{
    public function __construct(
        private readonly AcademicService $academicService,
        private readonly AcademicResponseSerializer $serializer,
    ) {
    }

    #[Route('', name: 'api_student_academics_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $records = $this->academicService->listRecords($user);

        return $this->json($this->serializer->serializeCollection($records));
    }

    #[Route('', name: 'api_student_academics_upsert', methods: ['POST'])]
    public function upsert(#[MapRequestPayload] SemesterRecordDto $dto): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $record = $this->academicService->upsertSemesterRecord($user, $dto);

        return $this->json([
            'message' => 'Semester record saved.',
            'record' => $this->serializer->serialize($record),
        ]);
    }

    #[Route('/{id}', name: 'api_student_academics_update_gpa', methods: ['PATCH'])]
    public function updateGpa(string $id, #[MapRequestPayload] CgpaRecordDto $dto): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        try {
            $record = $this->academicService->updateGpaById($user, (int) $id, $dto);

            return $this->json([
                'message' => 'GPA updated.',
                'record' => $this->serializer->serialize($record),
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'message' => $e->getMessage(),
            ], JsonResponse::HTTP_NOT_FOUND);
        }
    }
}
