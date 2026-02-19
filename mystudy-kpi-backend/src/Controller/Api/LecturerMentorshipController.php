<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\MentorshipAssignDto;
use App\Dto\UserCreateDto;
use App\Entity\User;
use App\Serializer\MentorshipResponseSerializer;
use App\Serializer\UserResponseSerializer;
use App\Service\AdminUserService;
use App\Service\MentorshipService;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/lecturer/mentorships')]
#[IsGranted('ROLE_LECTURER')]
class LecturerMentorshipController extends AbstractController
{
    public function __construct(
        private readonly MentorshipService $mentorshipService,
        private readonly AdminUserService $adminUserService,
        private readonly MentorshipResponseSerializer $mentorshipSerializer,
        private readonly UserResponseSerializer $userSerializer,
    ) {
    }

    #[Route('', name: 'api_lecturer_mentorships_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        /** @var User $lecturer */
        $lecturer = $this->getUser();
        if (!$lecturer instanceof User) {
            return $this->json(['message' => 'Unauthorized.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $results = $this->mentorshipService->findByLecturerForIndex($lecturer);
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

    #[Route('/{id}', name: 'api_lecturer_mentorships_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        /** @var User $lecturer */
        $lecturer = $this->getUser();
        if (!$lecturer instanceof User) {
            return $this->json(['message' => 'Unauthorized.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        try {
            $mentorship = $this->mentorshipService->findById($id, $lecturer);
            return $this->json($this->mentorshipSerializer->serializeFull($mentorship));
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('/available-students/{batchId}', name: 'api_lecturer_available_students', methods: ['GET'])]
    public function availableStudents(int $batchId): JsonResponse
    {
        $students = $this->mentorshipService->findAvailableStudents($batchId);
        $result = [];
        foreach ($students as $student) {
            $result[] = $this->userSerializer->serialize($student);
        }

        return $this->json($result);
    }

    #[Route('', name: 'api_lecturer_mentorships_assign', methods: ['POST'])]
    public function assign(#[MapRequestPayload] MentorshipAssignDto $dto): JsonResponse
    {
        /** @var User $lecturer */
        $lecturer = $this->getUser();
        if (!$lecturer instanceof User) {
            return $this->json(['message' => 'Unauthorized.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        try {
            $mentorship = $this->mentorshipService->createMentorship($lecturer, $dto->batchId, $dto->studentIds);
            return $this->json([
                'message' => 'Mentees assigned.',
                'mentorship' => $this->mentorshipSerializer->serialize($mentorship),
            ]);
        } catch (UniqueConstraintViolationException) {
            return $this->json(['message' => 'Some students are already assigned.'], JsonResponse::HTTP_CONFLICT);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/mentees/{id}', name: 'api_lecturer_mentees_delete', methods: ['DELETE'])]
    public function deleteMentee(string $id): JsonResponse
    {
        /** @var User $lecturer */
        $lecturer = $this->getUser();
        if (!$lecturer instanceof User) {
            return $this->json(['message' => 'Unauthorized.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        try {
            $this->mentorshipService->removeMentee($lecturer, $id);
            return $this->json(['message' => 'Mentee removed.']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('/mentorship-records/{id}', name: 'api_lecturer_mentorships_delete', methods: ['DELETE'])]
    public function deleteMentorship(int $id): JsonResponse
    {
        /** @var User $lecturer */
        $lecturer = $this->getUser();
        if (!$lecturer instanceof User) {
            return $this->json(['message' => 'Unauthorized.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        try {
            $this->mentorshipService->removeMentorship($lecturer, $id);
            return $this->json(['message' => 'Mentorship record deleted.']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    // Proxy to AdminUserService for creating students from within the lecturer page modal
    #[Route('/quick-student', name: 'api_lecturer_students_create', methods: ['POST'])]
    public function createStudent(#[MapRequestPayload] UserCreateDto $dto): JsonResponse
    {
        if ($dto->intakeBatchId === null) {
            return $this->json(['message' => 'Intake batch is required for students.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->adminUserService->createStudent($dto, $dto->intakeBatchId);

        return $this->json([
            'message' => 'Student account created.',
            'user' => $this->userSerializer->serialize($user),
        ], JsonResponse::HTTP_CREATED);
    }
}
