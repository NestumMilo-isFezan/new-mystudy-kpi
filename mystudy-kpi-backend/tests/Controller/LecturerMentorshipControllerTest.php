<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\IntakeBatch;
use App\Entity\User;
use App\Enum\UserRole;
use App\Entity\Profile;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class LecturerMentorshipControllerTest extends WebTestCase
{
    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->ensureTestDatabaseExists();

        self::ensureKernelShutdown();
        $this->client = self::createClient();

        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);

        $metadata = $entityManager->getMetadataFactory()->getAllMetadata();
        $schemaTool = new SchemaTool($entityManager);
        $schemaTool->dropDatabase();
        $schemaTool->createSchema($metadata);
    }

    private function ensureTestDatabaseExists(): void
    {
        $databaseUrl = (string) ($_SERVER['DATABASE_URL'] ?? $_ENV['DATABASE_URL'] ?? getenv('DATABASE_URL') ?: '');
        $parts = parse_url($databaseUrl);
        if (false === $parts || !isset($parts['host'], $parts['path'], $parts['user'])) {
            return;
        }

        $host = $parts['host'];
        $port = $parts['port'] ?? 5432;
        $user = $parts['user'];
        $pass = $parts['pass'] ?? '';
        $databaseName = ltrim((string) $parts['path'], '/').'_test';

        $pdo = new \PDO(sprintf('pgsql:host=%s;port=%d;dbname=postgres', $host, $port), $user, $pass);
        $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

        try {
            $pdo->exec(sprintf('CREATE DATABASE "%s"', str_replace('"', '""', $databaseName)));
        } catch (\PDOException $exception) {
            if ('42P04' !== ($exception->errorInfo[0] ?? null)) {
                throw $exception;
            }
        }
    }

    public function testLecturerAccessOnly(): void
    {
        $this->seedUser('STD100', 'student@example.com', 'secret123', UserRole::STUDENT);
        $this->login($this->client, 'STD100', 'secret123');

        $this->client->request('GET', '/api/lecturer/mentorships');
        self::assertResponseStatusCodeSame(403);
    }

    public function testLecturerCanAssignAndListMentees(): void
    {
        $this->seedUser('LEC001', 'lec001@example.com', 'secret123', UserRole::LECTURER);
        $this->login($this->client, 'LEC001', 'secret123');

        $batch = $this->seedIntakeBatch(2024);
        $student1 = $this->seedStudent('STD001', 'std001@example.com', $batch);
        $student2 = $this->seedStudent('STD002', 'std002@example.com', $batch);

        $assignData = [
            'batchId' => $batch->getId(),
            'studentIds' => [$student1->getId(), $student2->getId()]
        ];

        $this->client->request('POST', '/api/lecturer/mentorships', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($assignData, JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(200);

        // List
        $this->client->request('GET', '/api/lecturer/mentorships');
        self::assertResponseStatusCodeSame(200);
        $list = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        
        self::assertCount(1, $list);
        self::assertSame($batch->getId(), $list[0]['intakeBatch']['id']);
        self::assertCount(2, $list[0]['mentees']);
    }

    public function testAvailableStudentsFiltersCorrectly(): void
    {
        $this->seedUser('LEC002', 'lec002@example.com', 'secret123', UserRole::LECTURER);
        $this->login($this->client, 'LEC002', 'secret123');

        $batch = $this->seedIntakeBatch(2024);
        $student1 = $this->seedStudent('STD003', 'std003@example.com', $batch);
        $student2 = $this->seedStudent('STD004', 'std004@example.com', $batch);

        // Initially both available
        $this->client->request('GET', sprintf('/api/lecturer/mentorships/available-students/%d', $batch->getId()));
        $available = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(2, $available);

        // Assign one
        $assignData = [
            'batchId' => $batch->getId(),
            'studentIds' => [$student1->getId()]
        ];
        $this->client->request('POST', '/api/lecturer/mentorships', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($assignData, JSON_THROW_ON_ERROR));

        // Now only student2 should be available
        $this->client->request('GET', sprintf('/api/lecturer/mentorships/available-students/%d', $batch->getId()));
        $availableAfter = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $availableAfter);
        self::assertSame('STD004', $availableAfter[0]['identifier']);
    }

    public function testLecturerCanDeleteMentee(): void
    {
        $this->seedUser('LEC003', 'lec003@example.com', 'secret123', UserRole::LECTURER);
        $this->login($this->client, 'LEC003', 'secret123');

        $batch = $this->seedIntakeBatch(2024);
        $student = $this->seedStudent('STD005', 'std005@example.com', $batch);

        $assignData = [
            'batchId' => $batch->getId(),
            'studentIds' => [$student->getId()]
        ];
        $this->client->request('POST', '/api/lecturer/mentorships', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($assignData, JSON_THROW_ON_ERROR));

        // Delete
        $this->client->request('DELETE', sprintf('/api/lecturer/mentorships/mentees/%s', $student->getId()));
        self::assertResponseStatusCodeSame(200);

        // Verify gone from list
        $this->client->request('GET', '/api/lecturer/mentorships');
        $list = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(0, $list);
    }

    private function login(KernelBrowser $client, string $identifier, string $password): void
    {
        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['identifier' => $identifier, 'password' => $password], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(200);
    }

    private function seedUser(string $identifier, string $email, string $password, UserRole $role): User
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        /** @var UserPasswordHasherInterface $hasher */
        $hasher = self::getContainer()->get(UserPasswordHasherInterface::class);

        $user = (new User())
            ->setIdentifier($identifier)
            ->setEmail($email)
            ->setRole($role);

        $user->setPassword($hasher->hashPassword($user, $password));
        
        $profile = (new Profile())
            ->setUser($user)
            ->setFirstName('Test')
            ->setLastName('User');
        $user->setProfile($profile);

        $entityManager->persist($user);
        $entityManager->persist($profile);
        $entityManager->flush();

        return $user;
    }

    private function seedStudent(string $identifier, string $email, IntakeBatch $batch): User
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        /** @var UserPasswordHasherInterface $hasher */
        $hasher = self::getContainer()->get(UserPasswordHasherInterface::class);

        $user = (new User())
            ->setIdentifier($identifier)
            ->setEmail($email)
            ->setRole(UserRole::STUDENT)
            ->setIntakeBatch($batch);

        $user->setPassword($hasher->hashPassword($user, 'secret123'));
        
        $profile = (new Profile())
            ->setUser($user)
            ->setFirstName('Student')
            ->setLastName($identifier);
        $user->setProfile($profile);

        $entityManager->persist($user);
        $entityManager->persist($profile);
        $entityManager->flush();

        return $user;
    }

    private function seedIntakeBatch(int $startYear): IntakeBatch
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);

        $batch = (new IntakeBatch())
            ->setStartYear($startYear)
            ->setName(sprintf('Batch %d', $startYear));
        $entityManager->persist($batch);
        $entityManager->flush();

        return $batch;
    }
}
