<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\KpiAimUpdateDto;
use App\Entity\User;
use App\Service\KpiAimService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/student/kpi-aim')]
#[IsGranted('ROLE_STUDENT')]
class StudentKpiAimController extends AbstractController
{
    public function __construct(
        private readonly KpiAimService $kpiAimService,
    ) {
    }

    #[Route('', name: 'api_student_kpi_aim_get', methods: ['GET'])]
    public function getAim(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return $this->json($this->kpiAimService->getAims($user));
    }

    #[Route('', name: 'api_student_kpi_aim_update', methods: ['PUT'])]
    public function updateAim(#[MapRequestPayload] KpiAimUpdateDto $dto): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $this->kpiAimService->updatePersonalAim($user, $dto);

        return $this->json([
            'message' => 'KPI aim updated.',
            'aim' => $this->kpiAimService->getAims($user),
        ]);
    }
}
