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

final class AdminLecturerControllerTest extends WebTestCase
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

    public function testListLecturersRequiresAuthentication(): void
    {
        $this->client->request('GET', '/api/admin/lecturers');

        self::assertResponseStatusCodeSame(401);
    }

    public function testStudentCannotListLecturers(): void
    {
        $this->seedUser('STD100', 'student100@example.com', 'secret123', UserRole::STUDENT);
        $this->login($this->client, 'STD100', 'secret123');

        $this->client->request('GET', '/api/admin/lecturers');

        self::assertResponseStatusCodeSame(403);
    }

    public function testStaffCanCreateAndListLecturer(): void
    {
        $this->seedUser('STF100', 'staff100@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STF100', 'secret123');

        // Create Lecturer
        $lecturerData = [
            'identifier' => 'LEC001',
            'email' => 'lec001@example.com',
            'firstName' => 'John',
            'lastName' => 'Doe',
            'password' => 'securePassword123'
        ];

        $this->client->request('POST', '/api/admin/lecturers', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($lecturerData, JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(201);

        $response = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Lecturer account created.', $response['message']);
        self::assertSame('LEC001', $response['user']['identifier']);
        self::assertSame('John', $response['user']['firstName']);
        self::assertSame('Doe', $response['user']['lastName']);

        // List Lecturers
        $this->client->request('GET', '/api/admin/lecturers');
        self::assertResponseStatusCodeSame(200);

        $list = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $list);
        self::assertSame('LEC001', $list[0]['identifier']);
    }

    public function testDuplicateIdentifierIsRejected(): void
    {
        $this->seedUser('STF101', 'staff101@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STF101', 'secret123');

        $lecturerData = [
            'identifier' => 'LEC002',
            'email' => 'lec002@example.com',
            'firstName' => 'Jane',
            'lastName' => 'Smith',
            'password' => 'securePassword123'
        ];

        $this->client->request('POST', '/api/admin/lecturers', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($lecturerData, JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(201);

        // Try again with same identifier
        $this->client->request('POST', '/api/admin/lecturers', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($lecturerData, JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(409);
    }

    public function testStaffCanUpdateLecturer(): void
    {
        $this->seedUser('STF103', 'staff103@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STF103', 'secret123');

        // Create
        $lecturerData = [
            'identifier' => 'LEC004',
            'email' => 'lec004@example.com',
            'firstName' => 'Original',
            'lastName' => 'Name',
            'password' => 'securePassword123'
        ];

        $this->client->request('POST', '/api/admin/lecturers', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($lecturerData, JSON_THROW_ON_ERROR));
        $created = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        $lecturerId = $created['user']['id'];

        // Update
        $updateData = [
            'identifier' => 'LEC004-MOD',
            'email' => 'lec004-mod@example.com',
            'firstName' => 'Updated',
            'lastName' => 'Lecturer',
            'password' => 'newSecurePassword456'
        ];

        $this->client->request('PATCH', sprintf('/api/admin/lecturers/%s', $lecturerId), [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($updateData, JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(200);

        $response = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Lecturer account updated.', $response['message']);
        self::assertSame('LEC004-MOD', $response['user']['identifier']);
        self::assertSame('Updated', $response['user']['firstName']);

        // Verify login with new password
        $this->login($this->client, 'LEC004-MOD', 'newSecurePassword456');
    }

    private function login(KernelBrowser $client, string $identifier, string $password): void
    {
        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['identifier' => $identifier, 'password' => $password], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);
        self::assertNotNull($client->getCookieJar()->get('AUTH_TOKEN'));
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
}
