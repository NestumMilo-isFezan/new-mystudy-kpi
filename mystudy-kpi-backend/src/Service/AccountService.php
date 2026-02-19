<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\AccountUpdateDto;
use App\Dto\PasswordUpdateDto;
use App\Entity\User;
use App\Exception\InvalidCredentialsException;
use App\Exception\InvalidIntakeBatchException;
use App\Repository\IntakeBatchRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AccountService
{
    public function __construct(
        private readonly IntakeBatchRepository $intakeBatchRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function updateAccount(User $user, AccountUpdateDto $dto): User
    {
        $intakeBatch = $this->intakeBatchRepository->find($dto->intakeBatchId);
        if (!$intakeBatch || !$intakeBatch->isActive()) {
            throw new InvalidIntakeBatchException();
        }

        $user->setIntakeBatch($intakeBatch);
        $this->entityManager->flush();

        return $user;
    }

    public function updatePassword(User $user, PasswordUpdateDto $dto): void
    {
        if (!$this->passwordHasher->isPasswordValid($user, $dto->currentPassword)) {
            throw new InvalidCredentialsException('Invalid current password.');
        }

        $newHashedPassword = $this->passwordHasher->hashPassword($user, $dto->newPassword);
        $user->setPassword($newHashedPassword);
        $this->entityManager->flush();
    }

    public function deleteAccount(User $user): void
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }
}
