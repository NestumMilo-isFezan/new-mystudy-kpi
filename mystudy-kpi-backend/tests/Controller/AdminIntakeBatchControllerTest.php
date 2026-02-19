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

final class AdminIntakeBatchControllerTest extends WebTestCase
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

    public function testCreateBatchRequiresAuthentication(): void
    {
        $this->client->request('POST', '/api/admin/intake-batches', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['startYear' => 2021], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(401);
    }

    public function testStudentCannotCreateBatch(): void
    {
        $this->seedUser('STD100', 'student100@example.com', 'secret123', UserRole::STUDENT);
        $this->login($this->client, 'STD100', 'secret123');

        $this->client->request('POST', '/api/admin/intake-batches', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['startYear' => 2021], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(403);
    }

    public function testStaffCanCreateBatchWithGeneratedName(): void
    {
        $this->seedUser('STF100', 'staff100@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STF100', 'secret123');

        $this->client->request('POST', '/api/admin/intake-batches', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['startYear' => 2021], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(201);

        $response = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Intake batch created.', $response['message']);
        self::assertSame(2021, $response['batch']['startYear']);
        self::assertSame('21/22', $response['batch']['name']);
        self::assertTrue($response['batch']['isActive']);
    }

    public function testDuplicateStartYearIsRejected(): void
    {
        $this->seedUser('STF101', 'staff101@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STF101', 'secret123');

        $this->client->request('POST', '/api/admin/intake-batches', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['startYear' => 2021], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(201);

        $this->client->request('POST', '/api/admin/intake-batches', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['startYear' => 2021], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(409);

        $response = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Intake batch for this start year already exists.', $response['message']);
    }

    public function testStaffCanUpdateBatch(): void
    {
        $this->seedUser('STF102', 'staff102@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STF102', 'secret123');

        $this->client->request('POST', '/api/admin/intake-batches', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['startYear' => 2021], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(201);

        $created = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        $batchId = $created['batch']['id'];

        $this->client->request('PATCH', sprintf('/api/admin/intake-batches/%d', $batchId), [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['startYear' => 2022], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(200);

        $response = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Intake batch updated.', $response['message']);
        self::assertSame(2022, $response['batch']['startYear']);
        self::assertSame('22/23', $response['batch']['name']);
    }

    public function testUpdateBatchRejectsDuplicateStartYear(): void
    {
        $this->seedUser('STF103', 'staff103@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STF103', 'secret123');

        $this->client->request('POST', '/api/admin/intake-batches', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['startYear' => 2021], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(201);
        $firstBatch = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);

        $this->client->request('POST', '/api/admin/intake-batches', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['startYear' => 2022], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(201);
        $secondBatch = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);

        $this->client->request(
            'PATCH',
            sprintf('/api/admin/intake-batches/%d', $secondBatch['batch']['id']),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['startYear' => $firstBatch['batch']['startYear']], JSON_THROW_ON_ERROR)
        );

        self::assertResponseStatusCodeSame(409);

        $response = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Intake batch for this start year already exists.', $response['message']);
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
