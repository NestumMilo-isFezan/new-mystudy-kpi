<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Exception\NotFoundException;
use App\Serializer\AcademicResponseSerializer;
use App\Serializer\ChallengeResponseSerializer;
use App\Serializer\KpiAimResponseSerializer;
use App\Serializer\KpiRecordResponseSerializer;
use App\Serializer\UserResponseSerializer;
use App\Service\AcademicService;
use App\Service\ChallengeService;
use App\Service\KpiAggregationService;
use App\Service\KpiAimService;
use App\Service\KpiRecordService;
use App\Service\PaginationService;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/students')]
#[IsGranted('ROLE_STAFF')]
final class AdminStudentDetailController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly AcademicService $academicService,
        private readonly KpiRecordService $kpiRecordService,
        private readonly ChallengeService $challengeService,
        private readonly KpiAimService $kpiAimService,
        private readonly KpiAggregationService $kpiAggregationService,
        private readonly PaginationService $paginationService,
        private readonly UserResponseSerializer $userSerializer,
        private readonly AcademicResponseSerializer $academicSerializer,
        private readonly KpiRecordResponseSerializer $kpiRecordSerializer,
        private readonly ChallengeResponseSerializer $challengeSerializer,
        private readonly KpiAimResponseSerializer $kpiAimSerializer,
    ) {
    }

    private function getStudent(string $id): User
    {
        $student = $this->userRepository->find($id);
        if (!$student) {
            throw new NotFoundException('Student not found.');
        }

        return $student;
    }

    #[Route('/{id}/overview', name: 'api_admin_students_overview', methods: ['GET'])]
    public function overview(string $id): JsonResponse
    {
        $student = $this->getStudent($id);
        $summary = $this->kpiAggregationService->buildSummary($student);

        return $this->json([
            'student' => $this->userSerializer->serialize($student),
            ...$summary,
        ]);
    }

    #[Route('/{id}/academics', name: 'api_admin_students_academics', methods: ['GET'])]
    public function academics(string $id, Request $request): JsonResponse
    {
        $student = $this->getStudent($id);
        $sort = $this->paginationService->resolveAcademicSort($request);
        $semesterRaw = $this->paginationService->resolveFilter($request, 'semester');
        $semester = $semesterRaw !== null ? (int) $semesterRaw : null;
        $records = $this->academicService->listRecordsSortedFiltered(
            $student,
            $sort['sortBy'],
            $sort['sortDir'],
            $semester,
        );

        return $this->json($this->academicSerializer->serializeCollection($records));
    }

    #[Route('/{id}/kpi-records', name: 'api_admin_students_kpi_records', methods: ['GET'])]
    public function kpiRecords(string $id): JsonResponse
    {
        $student = $this->getStudent($id);
        $records = $this->kpiRecordService->listRecords($student);

        return $this->json($this->kpiRecordSerializer->serializeCollection($records));
    }

    #[Route('/{id}/kpi-records/page', name: 'api_admin_students_kpi_records_page', methods: ['GET'])]
    public function kpiRecordsPage(string $id, Request $request): JsonResponse
    {
        $student = $this->getStudent($id);
        $pagination = $this->paginationService->resolve($request);
        $sort = $this->paginationService->resolveKpiRecordSort($request);
        $typeRaw = $this->paginationService->resolveFilter($request, 'type');
        $type = in_array($typeRaw, ['activity', 'competition', 'certification'], true) ? $typeRaw : null;

        $resultPage = $this->kpiRecordService->listRecordsPage(
            $student,
            $pagination['page'],
            $pagination['limit'],
            $sort['sortBy'],
            $sort['sortDir'],
            $type,
        );

        return $this->json([
            'items' => $this->kpiRecordSerializer->serializeCollection($resultPage['items']),
            'pagination' => $this->paginationService->metadata(
                $pagination['page'],
                $pagination['limit'],
                $resultPage['total'],
            ),
        ]);
    }

    #[Route('/{id}/challenges', name: 'api_admin_students_challenges', methods: ['GET'])]
    public function challenges(string $id): JsonResponse
    {
        $student = $this->getStudent($id);
        $challenges = $this->challengeService->listChallenges($student);

        return $this->json($this->challengeSerializer->serializeCollection($challenges));
    }

    #[Route('/{id}/challenges/page', name: 'api_admin_students_challenges_page', methods: ['GET'])]
    public function challengesPage(string $id, Request $request): JsonResponse
    {
        $student = $this->getStudent($id);
        $pagination = $this->paginationService->resolve($request);
        $sort = $this->paginationService->resolveChallengeSort($request);
        $semesterRaw = $this->paginationService->resolveFilter($request, 'semester');
        $semester = $semesterRaw !== null ? (int) $semesterRaw : null;

        $resultPage = $this->challengeService->listChallengesPage(
            $student,
            $pagination['page'],
            $pagination['limit'],
            $sort['sortBy'],
            $sort['sortDir'],
            $semester,
        );

        return $this->json([
            'items' => $this->challengeSerializer->serializeCollection($resultPage['items']),
            'pagination' => $this->paginationService->metadata(
                $pagination['page'],
                $pagination['limit'],
                $resultPage['total'],
            ),
        ]);
    }

    #[Route('/{id}/kpi-target', name: 'api_admin_students_kpi_target', methods: ['GET'])]
    public function getKpiTarget(string $id): JsonResponse
    {
        $student = $this->getStudent($id);
        $aims = $this->kpiAimService->getAims($student);

        return $this->json($aims);
    }
}
