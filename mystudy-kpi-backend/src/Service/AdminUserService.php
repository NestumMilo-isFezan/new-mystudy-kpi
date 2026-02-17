<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\UserCreateDto;
use App\Entity\User;
use App\Enum\UserRole;
use App\Exception\DuplicateIdentifierException;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AdminUserService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function createLecturer(UserCreateDto $dto): User
    {
        if ($this->userRepository->findOneBy(['identifier' => strtoupper(trim($dto->identifier))])) {
            throw new DuplicateIdentifierException();
        }

        if ($this->userRepository->findOneBy(['email' => strtolower(trim($dto->email))])) {
            throw new DuplicateIdentifierException('Email is already used.');
        }

        $user = (new User())
            ->setIdentifier($dto->identifier)
            ->setEmail($dto->email)
            ->setRole(UserRole::LECTURER);

        $user->setPassword($this->passwordHasher->hashPassword($user, $dto->password));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }
}
