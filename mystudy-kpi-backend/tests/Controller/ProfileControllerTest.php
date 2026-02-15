<?php

namespace App\Tests\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class ProfileControllerTest extends WebTestCase
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

    public function testProfileEndpointsRequireAuthentication(): void
    {
        $client = $this->client;

        $client->request('GET', '/api/profile');
        self::assertResponseStatusCodeSame(401);

        $client->request('PUT', '/api/profile', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['firstName' => 'A', 'lastName' => 'B'], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(401);
    }

    public function testUserCanCreateAndReadProfileWithCookieAuth(): void
    {
        $client = $this->client;
        $this->seedUser('STD001', 'student1@example.com', 'secret123');

        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['identifier' => 'STD001', 'password' => 'secret123'], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);
        self::assertNotNull($client->getCookieJar()->get('AUTH_TOKEN'));

        $client->request('PUT', '/api/profile', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
                'firstName' => 'Jane',
                'lastName' => 'Doe',
                'bio' => 'Top student',
                'birthDate' => '2002-05-12',
                'birthPlace' => 'Kuching',
            ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);

        $client->request('GET', '/api/profile');
        self::assertResponseIsSuccessful();

        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Jane', $response['profile']['firstName']);
        self::assertSame('Doe', $response['profile']['lastName']);
        self::assertSame('Top student', $response['profile']['bio']);
        self::assertSame('2002-05-12', $response['profile']['birthDate']);
        self::assertSame('Kuching', $response['profile']['birthPlace']);
    }

    public function testPartialUpdateKeepsRequiredNames(): void
    {
        $client = $this->client;
        $this->seedUser('STD002', 'student2@example.com', 'secret123');
        $this->login($client, 'STD002', 'secret123');

        $client->request('PUT', '/api/profile', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['firstName' => 'John', 'lastName' => 'Smith'], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(200);

        $client->request('PUT', '/api/profile', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['bio' => 'Updated bio only'], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(200);

        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('John', $response['profile']['firstName']);
        self::assertSame('Smith', $response['profile']['lastName']);
        self::assertSame('Updated bio only', $response['profile']['bio']);
    }

    public function testRejectsFutureBirthDate(): void
    {
        $client = $this->client;
        $this->seedUser('STD003', 'student3@example.com', 'secret123');
        $this->login($client, 'STD003', 'secret123');

        $client->request('PUT', '/api/profile', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
                'firstName' => 'Future',
                'lastName' => 'Person',
                'birthDate' => '2999-01-01',
            ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(400);
        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('birthDate cannot be in the future.', $response['message']);
    }

    private function login(KernelBrowser $client, string $identifier, string $password): void
    {
        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['identifier' => $identifier, 'password' => $password], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);
        self::assertNotNull($client->getCookieJar()->get('AUTH_TOKEN'));
    }

    private function seedUser(string $identifier, string $email, string $password): void
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        /** @var UserPasswordHasherInterface $hasher */
        $hasher = self::getContainer()->get(UserPasswordHasherInterface::class);

        $user = (new User())
            ->setIdentifier($identifier)
            ->setEmail($email)
            ->setRoleValue(User::ROLE_STUDENT_VALUE);

        $user->setPassword($hasher->hashPassword($user, $password));

        $entityManager->persist($user);
        $entityManager->flush();
    }
}
