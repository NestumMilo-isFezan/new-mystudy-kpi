<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Service\KpiAggregationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/student/kpi-summary')]
#[IsGranted('ROLE_STUDENT')]
class StudentKpiSummaryController extends AbstractController
{
    public function __construct(
        private readonly KpiAggregationService $kpiAggregationService,
    ) {
    }

    #[Route('', name: 'api_student_kpi_summary', methods: ['GET'])]
    public function getSummary(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return $this->json($this->kpiAggregationService->buildSummary($user));
    }
}
