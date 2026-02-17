<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\ProfileUpdateDto;
use App\Entity\Profile;
use App\Entity\User;
use App\Exception\ProfileNameRequiredException;
use Doctrine\ORM\EntityManagerInterface;

class ProfileService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function upsertProfile(User $user, ProfileUpdateDto $dto): Profile
    {
        $profile = $user->getProfile();
        $isNew = false;

        if (null === $profile) {
            $profile = (new Profile())->setUser($user);
            $user->setProfile($profile);
            $isNew = true;
        }

        if ($dto->firstName !== null) {
            $profile->setFirstName(trim($dto->firstName));
        } elseif ($isNew) {
            throw new ProfileNameRequiredException();
        }

        if ($dto->lastName !== null) {
            $profile->setLastName(trim($dto->lastName));
        } elseif ($isNew) {
            throw new ProfileNameRequiredException();
        }

        if ($dto->bio !== null) {
            $profile->setBio(trim($dto->bio));
        }

        if ($dto->birthPlace !== null) {
            $profile->setBirthPlace(trim($dto->birthPlace));
        }

        if ($dto->birthDate !== null) {
            $profile->setBirthDate($dto->birthDate);
        }

        $this->entityManager->persist($profile);
        $this->entityManager->flush();

        return $profile;
    }
}
