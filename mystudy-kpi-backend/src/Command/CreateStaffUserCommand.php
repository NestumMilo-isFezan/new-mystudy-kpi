<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:user:create-staff', description: 'Seeds the initial staff user account.')]
class CreateStaffUserCommand extends Command
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('identifier', null, InputOption::VALUE_REQUIRED, 'Staff identifier')
            ->addOption('email', null, InputOption::VALUE_REQUIRED, 'Staff email')
            ->addOption('password', null, InputOption::VALUE_REQUIRED, 'Staff password');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $identifier = $this->resolveOption($input->getOption('identifier'), 'SEED_STAFF_IDENTIFIER');
        $email = $this->resolveOption($input->getOption('email'), 'SEED_STAFF_EMAIL');
        $plainPassword = $this->resolveOption($input->getOption('password'), 'SEED_STAFF_PASSWORD');

        if (!$identifier || !$email || !$plainPassword) {
            $io->error('identifier, email, and password are required via option or SEED_STAFF_* env vars.');

            return Command::FAILURE;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $io->error('Invalid email format.');

            return Command::FAILURE;
        }

        $normalizedIdentifier = strtoupper(trim($identifier));
        $normalizedEmail = strtolower(trim($email));

        if ($this->userRepository->findOneBy(['identifier' => $normalizedIdentifier])) {
            $io->error(sprintf('User with identifier "%s" already exists.', $normalizedIdentifier));

            return Command::FAILURE;
        }

        if ($this->userRepository->findOneBy(['email' => $normalizedEmail])) {
            $io->error(sprintf('User with email "%s" already exists.', $normalizedEmail));

            return Command::FAILURE;
        }

        $staffUser = (new User())
            ->setIdentifier($normalizedIdentifier)
            ->setEmail($normalizedEmail)
            ->setRoleValue(User::ROLE_STAFF_VALUE);

        $staffUser->setPassword($this->passwordHasher->hashPassword($staffUser, $plainPassword));

        $this->entityManager->persist($staffUser);
        $this->entityManager->flush();

        $io->success(sprintf('Staff user %s created successfully.', $staffUser->getIdentifier()));

        return Command::SUCCESS;
    }

    private function resolveOption(mixed $optionValue, string $envName): ?string
    {
        if (\is_string($optionValue) && '' !== trim($optionValue)) {
            return trim($optionValue);
        }

        $envValue = getenv($envName);
        if (false === $envValue) {
            return null;
        }

        $envValue = trim((string) $envValue);

        return '' === $envValue ? null : $envValue;
    }
}
