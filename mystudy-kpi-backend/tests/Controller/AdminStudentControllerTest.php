<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\IntakeBatch;
use App\Entity\User;
use App\Enum\UserRole;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AdminStudentControllerTest extends WebTestCase
{
    private static bool $databaseReady = false;
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
        if (self::$databaseReady) {
            return;
        }

        $databaseUrl = (string) ($_SERVER['DATABASE_URL'] ?? $_ENV['DATABASE_URL'] ?? getenv('DATABASE_URL') ?: '');
        $parts = parse_url($databaseUrl);
        if (false === $parts || !isset($parts['host'], $parts['path'], $parts['user'])) {
            throw new \RuntimeException('DATABASE_URL is invalid for integration tests.');
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

        self::$databaseReady = true;
    }

    public function testListStudentsRequiresStaffRole(): void
    {
        $this->seedUser('STD100', 'student@example.com', 'secret123', UserRole::STUDENT);
        $this->login($this->client, 'STD100', 'secret123');

        $this->client->request('GET', '/api/admin/students');
        self::assertResponseStatusCodeSame(403);
    }

    public function testStaffCanCreateAndListStudent(): void
    {
        $this->seedUser('STF100', 'staff100@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STF100', 'secret123');

        $batch = $this->seedIntakeBatch(2024);

        $studentData = [
            'identifier' => 'STD001',
            'email' => 'std001@example.com',
            'firstName' => 'Student',
            'lastName' => 'One',
            'intakeBatchId' => $batch->getId(),
            'password' => 'securePassword123'
        ];

        $this->client->request('POST', '/api/admin/students', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($studentData, JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(201);

        $response = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Student account created.', $response['message']);
        self::assertSame('STD001', $response['user']['identifier']);
        self::assertSame($batch->getId(), $response['user']['intake']['id']);
        self::assertSame($batch->getName(), $response['user']['intake']['name']);

        // List
        $this->client->request('GET', '/api/admin/students');
        self::assertResponseStatusCodeSame(200);
        $list = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $list);
        self::assertSame($batch->getName(), $list[0]['intake']['name']);
    }

    public function testStaffCanUpdateStudent(): void
    {
        $this->seedUser('STF101', 'staff101@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STF101', 'secret123');

        $batch1 = $this->seedIntakeBatch(2024);
        $batch2 = $this->seedIntakeBatch(2025);

        // Create
        $studentData = [
            'identifier' => 'STD002',
            'email' => 'std002@example.com',
            'firstName' => 'Before',
            'lastName' => 'Update',
            'intakeBatchId' => $batch1->getId(),
            'password' => 'securePassword123'
        ];
        $this->client->request('POST', '/api/admin/students', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($studentData, JSON_THROW_ON_ERROR));
        $created = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        $studentId = $created['user']['id'];

        // Update
        $updateData = [
            'identifier' => 'STD002-MOD',
            'email' => 'std002-mod@example.com',
            'firstName' => 'After',
            'lastName' => 'Update',
            'intakeBatchId' => $batch2->getId(),
        ];
        $this->client->request('PATCH', sprintf('/api/admin/students/%s', $studentId), [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($updateData, JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(200);

        $response = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('STD002-MOD', $response['user']['identifier']);
        self::assertSame($batch2->getId(), $response['user']['intake']['id']);
    }

    public function testStaffCanDeleteStudent(): void
    {
        $this->seedUser('STF102', 'staff102@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STF102', 'secret123');

        $batch = $this->seedIntakeBatch(2024);
        
        $studentData = [
            'identifier' => 'STD003',
            'email' => 'std003@example.com',
            'firstName' => 'To Be',
            'lastName' => 'Deleted',
            'intakeBatchId' => $batch->getId(),
            'password' => 'securePassword123'
        ];
        $this->client->request('POST', '/api/admin/students', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($studentData, JSON_THROW_ON_ERROR));
        $created = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        $studentId = $created['user']['id'];

        // Delete
        $this->client->request('DELETE', sprintf('/api/admin/students/%s', $studentId));
        self::assertResponseStatusCodeSame(200);

        // Verify gone
        $this->client->request('GET', '/api/admin/students');
        $list = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(0, $list);
    }

    private function login(KernelBrowser $client, string $identifier, string $password): void
    {
        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['identifier' => $identifier, 'password' => $password], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(200);
    }

    private function seedUser(string $identifier, string $email, string $password, UserRole $role): void
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

        $entityManager->persist($user);
        $entityManager->flush();
    }

    private function seedIntakeBatch(int $startYear): IntakeBatch
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);

        $batch = (new IntakeBatch())
            ->setStartYear($startYear)
            ->setName(sprintf('%d/%d', $startYear % 100, ($startYear + 1) % 100));
        $entityManager->persist($batch);
        $entityManager->flush();

        return $batch;
    }
}
