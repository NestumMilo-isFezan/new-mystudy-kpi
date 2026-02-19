<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\User;
use App\Entity\UserSession;
use App\Enum\UserRole;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class SessionControllerTest extends WebTestCase
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

    public function testLoginCreatesSessionInDatabase(): void
    {
        $this->seedUser('SESSION_USER', 'session@example.com', 'password123');

        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'identifier' => 'SESSION_USER',
            'password' => 'password123'
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);

        /** @var EntityManagerInterface $em */
        $em = self::getContainer()->get(EntityManagerInterface::class);
        $sessions = $em->getRepository(UserSession::class)->findAll();

        self::assertCount(1, $sessions);
        self::assertSame('SESSION_USER', $sessions[0]->getUser()?->getIdentifier());
    }

    public function testListSessions(): void
    {
        $this->seedUser('LIST_USER', 'list@example.com', 'password123');
        $this->login('LIST_USER', 'password123');

        $this->client->request('GET', '/api/sessions');
        self::assertResponseIsSuccessful();

        $data = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $data);
        self::assertTrue($data[0]['is_current']);
        self::assertArrayHasKey('ip_address', $data[0]);
        self::assertArrayHasKey('user_agent', $data[0]);
    }

    public function testRevokingSessionLogsOutUser(): void
    {
        $this->seedUser('REVOKE_USER', 'revoke@example.com', 'password123');
        
        // 1. Login to get a session
        $this->login('REVOKE_USER', 'password123');
        
        // 2. Get the session ID from DB
        /** @var EntityManagerInterface $em */
        $em = self::getContainer()->get(EntityManagerInterface::class);
        $session = $em->getRepository(UserSession::class)->findOneBy([]);
        $sessionId = $session->getId();

        // 3. Verify we can access a protected route
        $this->client->request('GET', '/api/sessions');
        self::assertResponseIsSuccessful();

        // 4. Revoke the session via API
        $this->client->request('DELETE', '/api/sessions/' . $sessionId);
        self::assertResponseIsSuccessful();

        // 5. Try to access again with the SAME cookie - should now be unauthorized
        $this->client->request('GET', '/api/sessions');
        self::assertResponseStatusCodeSame(401);
    }

    public function testRevokeOtherSessions(): void
    {
        $user = $this->seedUser('OTHERS_USER', 'others@example.com', 'password123');
        
        // 1. Manually create an "other" session in DB
        /** @var EntityManagerInterface $em */
        $em = self::getContainer()->get(EntityManagerInterface::class);
        $otherSession = new UserSession();
        $otherSession->setUser($user);
        $otherSession->setExpiresAt(new \DateTimeImmutable('+30 days'));
        $em->persist($otherSession);
        $em->flush();

        // 2. Login as current user
        $this->login('OTHERS_USER', 'password123');

        // 3. Verify there are 2 sessions
        $this->client->request('GET', '/api/sessions');
        $dataBefore = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(2, $dataBefore);

        // 4. Revoke others
        $this->client->request('POST', '/api/sessions/revoke-all-others');
        self::assertResponseIsSuccessful();

        // 5. Verify only 1 session remains (the current one)
        $this->client->request('GET', '/api/sessions');
        $dataAfter = json_decode($this->client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $dataAfter);
        self::assertTrue($dataAfter[0]['is_current']);
    }

    private function login(string $identifier, string $password): void
    {
        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'identifier' => $identifier, 
            'password' => $password
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);
        self::assertNotNull($this->client->getCookieJar()->get('AUTH_TOKEN'));
    }

    private function seedUser(string $identifier, string $email, string $password): User
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        /** @var UserPasswordHasherInterface $hasher */
        $hasher = self::getContainer()->get(UserPasswordHasherInterface::class);

        $user = (new User())
            ->setIdentifier($identifier)
            ->setEmail($email)
            ->setRole(UserRole::STUDENT);

        $user->setPassword($hasher->hashPassword($user, $password));

        $entityManager->persist($user);
        $entityManager->flush();

        return $user;
    }
}
