<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\RegistrationDto;
use App\Entity\User;
use App\Enum\UserRole;
use App\Exception\DuplicateIdentifierException;
use App\Exception\InvalidCredentialsException;
use App\Exception\InvalidIntakeBatchException;
use App\Exception\MissingCredentialsException;
use App\Repository\IntakeBatchRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly IntakeBatchRepository $intakeBatchRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function register(RegistrationDto $dto): User
    {
        if ($this->userRepository->findOneBy(['identifier' => strtoupper(trim($dto->identifier))])) {
            throw new DuplicateIdentifierException();
        }

        if ($this->userRepository->findOneBy(['email' => strtolower(trim($dto->email))])) {
            throw new DuplicateIdentifierException('Email is already used.');
        }

        $intakeBatch = $this->intakeBatchRepository->find($dto->intakeBatchId);
        if (!$intakeBatch || !$intakeBatch->isActive()) {
            throw new InvalidIntakeBatchException();
        }

        $user = (new User())
            ->setIdentifier($dto->identifier)
            ->setEmail($dto->email)
            ->setRole(UserRole::STUDENT)
            ->setIntakeBatch($intakeBatch);

        $hashedPassword = $this->passwordHasher->hashPassword($user, $dto->password);
        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }

    public function authenticate(string $login, string $password): User
    {
        $normalizedLogin = trim($login);

        if ('' === $normalizedLogin || '' === trim($password)) {
            throw new MissingCredentialsException();
        }

        $user = filter_var($normalizedLogin, FILTER_VALIDATE_EMAIL)
            ? $this->userRepository->findOneBy(['email' => strtolower($normalizedLogin)])
            : $this->userRepository->findOneBy(['identifier' => strtoupper($normalizedLogin)]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            throw new InvalidCredentialsException();
        }

        return $user;
    }
}
