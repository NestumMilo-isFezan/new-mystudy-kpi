<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Repository\IntakeBatchRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class IntakeBatchController extends AbstractController
{
    #[Route('/intake-batches', name: 'api_intake_batches', methods: ['GET'])]
    public function list(IntakeBatchRepository $intakeBatchRepository): JsonResponse
    {
        $batches = $intakeBatchRepository->findActiveBatches();
        $result = [];

        foreach ($batches as $batch) {
            $result[] = [
                'id' => $batch->getId(),
                'name' => $batch->getName(),
                'isActive' => $batch->isActive(),
            ];
        }

        return $this->json($result);
    }
}
