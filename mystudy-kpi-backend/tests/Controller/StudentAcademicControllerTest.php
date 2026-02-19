<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\User;
use App\Enum\UserRole;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class StudentAcademicControllerTest extends WebTestCase
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

    public function testAcademicEndpointsRequireStudentRole(): void
    {
        $client = $this->client;
        
        // No auth
        $client->request('GET', '/api/student/academics');
        self::assertResponseStatusCodeSame(401);

        // Staff auth (should be 403 Forbidden)
        $this->seedUser('STAFF001', 'staff@example.com', 'secret123', UserRole::STAFF);
        $this->login($client, 'STAFF001', 'secret123');
        $client->request('GET', '/api/student/academics');
        self::assertResponseStatusCodeSame(403);
    }

    public function testStudentCanUpsertAndListAcademicRecords(): void
    {
        $client = $this->client;
        $this->seedUser('STD001', 'student1@example.com', 'secret123', UserRole::STUDENT);
        $this->login($client, 'STD001', 'secret123');

        // 1. Create a record
        $client->request('POST', '/api/student/academics', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'semester' => 1,
            'academicYear' => 2024,
            'gpa' => '3.75',
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);
        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Semester record saved.', $response['message']);
        self::assertSame(1, $response['record']['semester']);
        self::assertSame(2024, $response['record']['academicYear']);
        self::assertSame('2024/2025', $response['record']['academicYearString']);
        self::assertSame('3.75', $response['record']['gpa']);

        // 2. List records
        $client->request('GET', '/api/student/academics');
        self::assertResponseIsSuccessful();
        $list = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $list);
        self::assertSame('3.75', $list[0]['gpa']);

        // 3. Upsert (Update) the same record
        $client->request('POST', '/api/student/academics', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'semester' => 1,
            'academicYear' => 2024,
            'gpa' => '3.80',
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);
        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('3.80', $response['record']['gpa']);

        // 4. Verify count is still 1
        $client->request('GET', '/api/student/academics');
        $list = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $list);
        self::assertSame('3.80', $list[0]['gpa']);
    }

    public function testStudentCanUpdateGpaIndividually(): void
    {
        $client = $this->client;
        $this->seedUser('STD002', 'student2@example.com', 'secret123', UserRole::STUDENT);
        $this->login($client, 'STD002', 'secret123');

        // Create initial record
        $client->request('POST', '/api/student/academics', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'semester' => 2,
            'academicYear' => 2023,
            'gpa' => '3.50',
        ], JSON_THROW_ON_ERROR));
        
        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        $recordId = $response['record']['id'];

        // Update GPA only
        $client->request('PATCH', '/api/student/academics/' . $recordId, [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'gpa' => '3.99',
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);
        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('3.99', $response['record']['gpa']);
    }

    public function testValidationErrors(): void
    {
        $client = $this->client;
        $this->seedUser('STD003', 'student3@example.com', 'secret123', UserRole::STUDENT);
        $this->login($client, 'STD003', 'secret123');

        // Invalid semester
        $client->request('POST', '/api/student/academics', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'semester' => 11,
            'academicYear' => 2024,
            'gpa' => '3.75',
        ], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(422);

        // Invalid academic year
        $client->request('POST', '/api/student/academics', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'semester' => 1,
            'academicYear' => 1999,
            'gpa' => '3.75',
        ], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(422);

        // Invalid GPA
        $client->request('POST', '/api/student/academics', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'semester' => 1,
            'academicYear' => 2024,
            'gpa' => '5.00',
        ], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(422);
    }

    public function testStudentGetsScaffoldedRecordsOnFirstLoad(): void
    {
        $client = $this->client;
        
        // Seed a batch and a user with that batch
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $batch = (new \App\Entity\IntakeBatch())->setName('Batch 2021')->setStartYear(2021);
        $entityManager->persist($batch);
        $entityManager->flush();

        $this->seedUser('STD_SCAFFOLD', 'scaffold@example.com', 'secret123', UserRole::STUDENT, $batch);
        $this->login($client, 'STD_SCAFFOLD', 'secret123');

        // Initial load should trigger scaffolding
        $client->request('GET', '/api/student/academics');
        self::assertResponseIsSuccessful();
        $list = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        
        // Should have 8 records (4 years * 2 sems)
        self::assertCount(8, $list);
        self::assertSame('1-2021/2022', $list[0]['termString']);
        self::assertSame('2-2021/2022', $list[1]['termString']);
        self::assertSame('1-2022/2023', $list[2]['termString']);
        self::assertNull($list[0]['gpa']);
    }

    private function login(KernelBrowser $client, string $identifier, string $password): void
    {
        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['identifier' => $identifier, 'password' => $password], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);
        self::assertNotNull($client->getCookieJar()->get('AUTH_TOKEN'));
    }

    private function seedUser(string $identifier, string $email, string $password, UserRole $role, ?\App\Entity\IntakeBatch $batch = null): void
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        /** @var UserPasswordHasherInterface $hasher */
        $hasher = self::getContainer()->get(UserPasswordHasherInterface::class);

        $user = (new User())
            ->setIdentifier($identifier)
            ->setEmail($email)
            ->setRole($role);
        
        if ($batch) {
            $user->setIntakeBatch($batch);
        }

        $user->setPassword($hasher->hashPassword($user, $password));

        $entityManager->persist($user);
        $entityManager->flush();
    }
}
