<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\ChallengeDto;
use App\Entity\User;
use App\Serializer\ChallengeResponseSerializer;
use App\Service\ChallengeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/student/challenges')]
#[IsGranted('ROLE_STUDENT')]
class StudentChallengeController extends AbstractController
{
    public function __construct(
        private readonly ChallengeService $challengeService,
        private readonly ChallengeResponseSerializer $serializer,
    ) {
    }

    #[Route('', name: 'api_student_challenges_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $challenges = $this->challengeService->listChallenges($user);

        return $this->json($this->serializer->serializeCollection($challenges));
    }

    #[Route('', name: 'api_student_challenges_create', methods: ['POST'])]
    public function create(#[MapRequestPayload] ChallengeDto $dto): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        try {
            $challenge = $this->challengeService->createChallenge($user, $dto);

            return $this->json([
                'message' => 'Challenge record created.',
                'challenge' => $this->serializer->serialize($challenge),
            ], JsonResponse::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'api_student_challenges_update', methods: ['PATCH'])]
    public function update(string $id, #[MapRequestPayload] ChallengeDto $dto): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        try {
            $challenge = $this->challengeService->updateChallenge($user, (int) $id, $dto);

            return $this->json([
                'message' => 'Challenge record updated.',
                'challenge' => $this->serializer->serialize($challenge),
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('/{id}', name: 'api_student_challenges_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        try {
            $this->challengeService->deleteChallenge($user, (int) $id);

            return $this->json(['message' => 'Challenge record deleted.']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        }
    }
}
