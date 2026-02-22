<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\UserCreateDto;
use App\Dto\UserUpdateDto;
use App\Entity\Profile;
use App\Entity\User;
use App\Enum\SortableUserColumn;
use App\Enum\UserRole;
use App\Exception\DuplicateIdentifierException;
use App\Exception\InvalidIntakeBatchException;
use App\Exception\NotFoundException;
use App\Repository\IntakeBatchRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AdminUserService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly IntakeBatchRepository $intakeBatchRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * Returns all lecturers (unbounded) for use in assignment dropdowns.
     * Not paginated — use only for small, bounded reference lists.
     *
     * @return User[]
     */
    public function findAllLecturers(): array
    {
        return $this->userRepository->findAllByRole(UserRole::LECTURER);
    }

    /**
     * @return array{items: User[], total: int}
     */
    public function findLecturersPage(
        int $page,
        int $limit,
        SortableUserColumn $sortBy = SortableUserColumn::Identifier,
        string $sortDir = 'ASC',
    ): array {
        return $this->userRepository->findByRolePaginated(UserRole::LECTURER, $page, $limit, $sortBy, $sortDir);
    }

    /**
     * @return array{items: User[], total: int}
     */
    public function findStudentsPage(
        int $page,
        int $limit,
        SortableUserColumn $sortBy = SortableUserColumn::Identifier,
        string $sortDir = 'ASC',
        ?int $startYear = null,
    ): array {
        return $this->userRepository->findByRolePaginated(UserRole::STUDENT, $page, $limit, $sortBy, $sortDir, $startYear);
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

        $profile = (new Profile())
            ->setUser($user)
            ->setFirstName($dto->firstName)
            ->setLastName($dto->lastName);

        $user->setProfile($profile);

        $this->entityManager->persist($user);
        $this->entityManager->persist($profile);
        $this->entityManager->flush();

        return $user;
    }

    public function createStudent(UserCreateDto $dto, int $intakeBatchId): User
    {
        if ($this->userRepository->findOneBy(['identifier' => strtoupper(trim($dto->identifier))])) {
            throw new DuplicateIdentifierException();
        }

        if ($this->userRepository->findOneBy(['email' => strtolower(trim($dto->email))])) {
            throw new DuplicateIdentifierException('Email is already used.');
        }

        $intakeBatch = $this->intakeBatchRepository->find($intakeBatchId);
        if (!$intakeBatch) {
            throw new InvalidIntakeBatchException();
        }

        $user = (new User())
            ->setIdentifier($dto->identifier)
            ->setEmail($dto->email)
            ->setRole(UserRole::STUDENT)
            ->setIntakeBatch($intakeBatch);

        $user->setPassword($this->passwordHasher->hashPassword($user, $dto->password));

        $profile = (new Profile())
            ->setUser($user)
            ->setFirstName($dto->firstName)
            ->setLastName($dto->lastName);

        $user->setProfile($profile);

        $this->entityManager->persist($user);
        $this->entityManager->persist($profile);
        $this->entityManager->flush();

        return $user;
    }

    public function updateLecturer(string $id, UserUpdateDto $dto): User
    {
        $user = $this->userRepository->find($id);

        if (!$user || $user->getRole() !== UserRole::LECTURER) {
            throw new NotFoundException('Lecturer not found.');
        }

        return $this->updateUser($user, $dto);
    }

    public function updateStudent(string $id, UserUpdateDto $dto, ?int $intakeBatchId = null): User
    {
        $user = $this->userRepository->find($id);

        if (!$user || $user->getRole() !== UserRole::STUDENT) {
            throw new NotFoundException('Student not found.');
        }

        if ($intakeBatchId !== null) {
            $intakeBatch = $this->intakeBatchRepository->find($intakeBatchId);
            if (!$intakeBatch) {
                throw new InvalidIntakeBatchException();
            }
            $user->setIntakeBatch($intakeBatch);
        }

        return $this->updateUser($user, $dto);
    }

    private function updateUser(User $user, UserUpdateDto $dto): User
    {
        $normalizedIdentifier = strtoupper(trim($dto->identifier));
        $existingByIdentifier = $this->userRepository->findOneBy(['identifier' => $normalizedIdentifier]);
        if ($existingByIdentifier && $existingByIdentifier->getId() !== $user->getId()) {
            throw new DuplicateIdentifierException();
        }

        $normalizedEmail = strtolower(trim($dto->email));
        $existingByEmail = $this->userRepository->findOneBy(['email' => $normalizedEmail]);
        if ($existingByEmail && $existingByEmail->getId() !== $user->getId()) {
            throw new DuplicateIdentifierException('Email is already used.');
        }

        $user->setIdentifier($dto->identifier)
            ->setEmail($dto->email);

        if ($dto->password) {
            $user->setPassword($this->passwordHasher->hashPassword($user, $dto->password));
        }

        $profile = $user->getProfile();
        if (!$profile) {
            $profile = (new Profile())->setUser($user);
            $user->setProfile($profile);
            $this->entityManager->persist($profile);
        }

        $profile->setFirstName($dto->firstName)
            ->setLastName($dto->lastName);

        $this->entityManager->flush();

        return $user;
    }

    public function deleteUser(string $id): void
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            throw new NotFoundException('User not found.');
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }

    public function deleteLecturer(string $id): void
    {
        $user = $this->userRepository->find($id);

        if (!$user || $user->getRole() !== UserRole::LECTURER) {
            throw new NotFoundException('Lecturer not found.');
        }

        $this->deleteUser($id);
    }

    public function deleteStudent(string $id): void
    {
        $user = $this->userRepository->find($id);

        if (!$user || $user->getRole() !== UserRole::STUDENT) {
            throw new NotFoundException('Student not found.');
        }

        $this->deleteUser($id);
    }
}
