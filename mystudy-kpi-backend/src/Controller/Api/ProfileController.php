<?php

namespace App\Controller\Api;

use App\Entity\Profile;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/profile')]
class ProfileController extends AbstractController
{
    #[Route('', name: 'api_profile_get', methods: ['GET'])]
    public function getProfile(): JsonResponse
    {
        $user = $this->getCurrentUser();
        if ($user instanceof JsonResponse) {
            return $user;
        }

        $profile = $user->getProfile();

        return $this->json([
            'user' => $this->serializeUser($user),
            'profile' => $this->serializeProfile($profile),
        ]);
    }

    #[Route('', name: 'api_profile_upsert', methods: ['PUT'])]
    public function upsertProfile(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getCurrentUser();
        if ($user instanceof JsonResponse) {
            return $user;
        }

        try {
            $payload = $request->toArray();
        } catch (\JsonException) {
            return $this->json(['message' => 'Invalid JSON body.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $profile = $user->getProfile();
        if (null === $profile) {
            $profile = (new Profile())->setUser($user);
            $user->setProfile($profile);
        }

        $validationError = $this->applyProfileUpdate($profile, $payload);
        if (null !== $validationError) {
            return $this->json(['message' => $validationError], JsonResponse::HTTP_BAD_REQUEST);
        }

        $entityManager->persist($profile);
        $entityManager->flush();

        return $this->json([
            'message' => 'Profile saved successfully.',
            'user' => $this->serializeUser($user),
            'profile' => $this->serializeProfile($profile),
        ]);
    }

    private function getCurrentUser(): User|JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Unauthorized.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return $user;
    }

    /** @param array<string, mixed> $payload */
    private function applyProfileUpdate(Profile $profile, array $payload): ?string
    {
        if (array_key_exists('firstName', $payload)) {
            if (!\is_string($payload['firstName'])) {
                return 'firstName must be a string.';
            }

            $firstName = trim($payload['firstName']);
            if ('' === $firstName || strlen($firstName) > 100) {
                return 'firstName is required and must be at most 100 characters.';
            }

            $profile->setFirstName($firstName);
        }

        if (array_key_exists('lastName', $payload)) {
            if (!\is_string($payload['lastName'])) {
                return 'lastName must be a string.';
            }

            $lastName = trim($payload['lastName']);
            if ('' === $lastName || strlen($lastName) > 100) {
                return 'lastName is required and must be at most 100 characters.';
            }

            $profile->setLastName($lastName);
        }

        if (array_key_exists('bio', $payload)) {
            if (null !== $payload['bio'] && !\is_string($payload['bio'])) {
                return 'bio must be a string or null.';
            }

            if (\is_string($payload['bio']) && strlen(trim($payload['bio'])) > 1000) {
                return 'bio must be at most 1000 characters.';
            }

            $profile->setBio($payload['bio']);
        }

        if (array_key_exists('birthPlace', $payload)) {
            if (null !== $payload['birthPlace'] && !\is_string($payload['birthPlace'])) {
                return 'birthPlace must be a string or null.';
            }

            if (\is_string($payload['birthPlace']) && strlen(trim($payload['birthPlace'])) > 150) {
                return 'birthPlace must be at most 150 characters.';
            }

            $profile->setBirthPlace($payload['birthPlace']);
        }

        if (array_key_exists('birthDate', $payload)) {
            if (null === $payload['birthDate']) {
                $profile->setBirthDate(null);
            } elseif (!\is_string($payload['birthDate'])) {
                return 'birthDate must be a YYYY-MM-DD string or null.';
            } else {
                $birthDate = \DateTimeImmutable::createFromFormat('Y-m-d', $payload['birthDate']);
                $errors = \DateTimeImmutable::getLastErrors();

                if (false === $birthDate || (false !== $errors && (0 !== $errors['warning_count'] || 0 !== $errors['error_count']))) {
                    return 'birthDate must follow YYYY-MM-DD format.';
                }

                $today = new \DateTimeImmutable('today');
                if ($birthDate > $today) {
                    return 'birthDate cannot be in the future.';
                }

                $profile->setBirthDate($birthDate);
            }
        }

        if ('' === trim($profile->getFirstName() ?? '')) {
            return 'firstName is required.';
        }

        if ('' === trim($profile->getLastName() ?? '')) {
            return 'lastName is required.';
        }

        return null;
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

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->getId(),
            'identifier' => $user->getIdentifier(),
            'email' => $user->getEmail(),
            'role' => $user->getRoleValue(),
        ];
    }
}
