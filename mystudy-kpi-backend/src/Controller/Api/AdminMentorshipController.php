<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\KpiAimUpdateDto;
use App\Dto\MenteeNotesUpdateDto;
use App\Dto\MentorshipAssignDto;
use App\Entity\User;
use App\Repository\IntakeBatchRepository;
use App\Serializer\KpiAimResponseSerializer;
use App\Serializer\MentorshipResponseSerializer;
use App\Serializer\UserResponseSerializer;
use App\Service\KpiAimService;
use App\Service\MentorshipService;
use App\Service\PaginationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/mentorships')]
#[IsGranted('ROLE_STAFF')]
final class AdminMentorshipController extends AbstractController
{
    public function __construct(
        private readonly MentorshipService $mentorshipService,
        private readonly KpiAimService $kpiAimService,
        private readonly PaginationService $paginationService,
        private readonly IntakeBatchRepository $intakeBatchRepository,
        private readonly UserResponseSerializer $userSerializer,
        private readonly KpiAimResponseSerializer $kpiAimSerializer,
        private readonly MentorshipResponseSerializer $mentorshipSerializer,
    ) {
    }

    #[Route('', name: 'api_admin_mentorships_list', methods: ['GET'])]
    public function listMentorships(): JsonResponse
    {
        $results = $this->mentorshipService->findAllForIndex();
        $result = [];
        foreach ($results as $row) {
            $result[] = $this->mentorshipSerializer->serialize(
                $row['mentorship'], 
                $row['mentees'], 
                $row['menteeCount']
            );
        }

        return $this->json($result);
    }

    #[Route('/page', name: 'api_admin_mentorships_page', methods: ['GET'])]
    public function listMentorshipsPage(Request $request): JsonResponse
    {
        $pagination = $this->paginationService->resolve($request);
        $sort = $this->paginationService->resolveMentorshipSort($request);
        $startYearRaw = $this->paginationService->resolveFilter($request, 'startYear');
        $startYear = $startYearRaw !== null ? (int) $startYearRaw : null;
        $lecturerId = $this->paginationService->resolveFilter($request, 'lecturerId');

        $page = $this->mentorshipService->findAllPage(
            $pagination['page'],
            $pagination['limit'],
            $sort['sortBy'],
            $sort['sortDir'],
            $startYear,
            $lecturerId,
        );

        $items = [];
        foreach ($page['items'] as $row) {
            $items[] = $this->mentorshipSerializer->serialize(
                $row['mentorship'],
                $row['mentees'],
                $row['menteeCount'],
            );
        }

        return $this->json([
            'items' => $items,
            'pagination' => $this->paginationService->metadata(
                $pagination['page'],
                $pagination['limit'],
                $page['total'],
            ),
        ]);
    }

    #[Route('/{id}', name: 'api_admin_mentorships_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function showMentorship(int $id): JsonResponse
    {
        try {
            $mentorship = $this->mentorshipService->findByIdGlobal($id);
            return $this->json($this->mentorshipSerializer->serializeFull($mentorship));
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('', name: 'api_admin_mentorships_assign', methods: ['POST'])]
    public function assignMentorship(#[MapRequestPayload] MentorshipAssignDto $dto): JsonResponse
    {
        if (!$dto->lecturerId) {
            return $this->json(['message' => 'Lecturer ID is required.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            $mentorship = $this->mentorshipService->createMentorshipForLecturer($dto->lecturerId, $dto->batchId, $dto->studentIds);
            return $this->json([
                'message' => 'Mentees assigned.',
                'mentorship' => $this->mentorshipSerializer->serialize($mentorship),
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/mentees', name: 'api_admin_mentees_list', methods: ['GET'])]
    public function listMentees(): JsonResponse
    {
        $mentees = $this->mentorshipService->findAllMentees();
        $result = [];
        foreach ($mentees as $mentee) {
            $result[] = [
                'student' => $this->userSerializer->serialize($mentee->getStudent()),
                'lecturer' => $this->userSerializer->serialize($mentee->getMentorship()->getLecturer()),
                'batch' => [
                    'id' => $mentee->getMentorship()->getIntakeBatch()->getId(),
                    'name' => $mentee->getMentorship()->getIntakeBatch()->getName(),
                ],
                'notes' => $mentee->getNotes(),
            ];
        }

        return $this->json($result);
    }

    #[Route('/available-students/{batchId}', name: 'api_admin_available_students', methods: ['GET'])]
    public function availableStudents(int $batchId): JsonResponse
    {
        $students = $this->mentorshipService->findAvailableStudents($batchId);
        $result = [];
        foreach ($students as $student) {
            $result[] = $this->userSerializer->serialize($student);
        }

        return $this->json($result);
    }

    #[Route('/mentees/{studentId}/notes', name: 'api_admin_mentees_update_notes', methods: ['PATCH'])]
    public function updateNotes(string $studentId, #[MapRequestPayload] MenteeNotesUpdateDto $dto): JsonResponse
    {
        try {
            $this->mentorshipService->updateMenteeNotes($studentId, $dto->notes);
            return $this->json(['message' => 'Notes updated.']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('/mentees/{studentId}', name: 'api_admin_mentees_delete', methods: ['DELETE'])]
    public function deleteMentee(string $studentId): JsonResponse
    {
        try {
            $this->mentorshipService->removeMenteeByStaff($studentId);
            return $this->json(['message' => 'Mentee removed.']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('/standard-aims/{batchId}', name: 'api_admin_standard_aims_show', methods: ['GET'])]
    public function getStandardAim(int $batchId): JsonResponse
    {
        $batch = $this->intakeBatchRepository->find($batchId);
        if (!$batch) {
            return $this->json(['message' => 'Intake batch not found.'], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json($this->kpiAimService->getBatchAim($batch));
    }

    #[Route('/standard-aims/{batchId}', name: 'api_admin_standard_aims_update', methods: ['POST'])]
    public function updateStandardAim(int $batchId, #[MapRequestPayload] KpiAimUpdateDto $dto): JsonResponse
    {
        /** @var User $staff */
        $staff = $this->getUser();
        $batch = $this->intakeBatchRepository->find($batchId);
        if (!$batch) {
            return $this->json(['message' => 'Intake batch not found.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $aim = $this->kpiAimService->updateStandardAim($batch, $staff, $dto);

        return $this->json([
            'message' => 'Standard KPI target updated.',
            'aim' => $this->kpiAimSerializer->serializeSingle($aim),
        ]);
    }
}
