<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\ProfileUpdateDto;
use App\Entity\Profile;
use App\Entity\User;
use App\Service\ProfileService;
use App\Serializer\UserResponseSerializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/profile')]
#[IsGranted('IS_AUTHENTICATED_FULLY')]
class ProfileController extends AbstractController
{
    public function __construct(
        private readonly ProfileService $profileService,
        private readonly UserResponseSerializer $userResponseSerializer,
    ) {
    }

    #[Route('', name: 'api_profile_get', methods: ['GET'])]
    public function getProfile(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $profile = $user->getProfile();

        return $this->json([
            'user' => $this->userResponseSerializer->serialize($user),
            'profile' => $this->serializeProfile($profile),
        ]);
    }

    #[Route('', name: 'api_profile_upsert', methods: ['PUT'])]
    public function upsertProfile(#[MapRequestPayload] ProfileUpdateDto $dto): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $profile = $this->profileService->upsertProfile($user, $dto);

        return $this->json([
            'message' => 'Profile saved successfully.',
            'user' => $this->userResponseSerializer->serialize($user),
            'profile' => $this->serializeProfile($profile),
        ]);
    }

    private function serializeProfile(?Profile $profile): ?array
    {
        if (null === $profile) {
            return null;
        }

        return [
            'id' => $profile->getId(),
            'firstName' => $profile->getFirstName(),
            'lastName' => $profile->getLastName(),
            'bio' => $profile->getBio(),
            'birthDate' => $profile->getBirthDate()?->format('Y-m-d'),
            'birthPlace' => $profile->getBirthPlace(),
        ];
    }
}
