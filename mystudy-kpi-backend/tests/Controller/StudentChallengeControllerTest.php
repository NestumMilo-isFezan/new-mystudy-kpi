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

final class StudentChallengeControllerTest extends WebTestCase
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

    public function testStudentCanManageChallenges(): void
    {
        $client = $this->client;
        $this->seedUser('STD001', 'student1@example.com', 'secret123', UserRole::STUDENT);
        $this->login($client, 'student1@example.com', 'secret123');

        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => 'student1@example.com']);

        // 1. Create a semester record
        $sem = (new \App\Entity\SemesterRecord())->setStudent($user)->setSemester(1)->setAcademicYear(2021);
        $entityManager->persist($sem);
        $entityManager->flush();
        $semId = $sem->getId();

        // 2. Create a Challenge
        $client->request('POST', '/api/student/challenges', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'semesterRecordId' => $semId,
            'challenge' => 'Struggling with Advanced Programming',
            'plan' => 'Attend more workshops and practice daily',
            'notes' => 'Need to focus on OOP concepts',
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(201);
        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Challenge record created.', $response['message']);
        self::assertSame('Struggling with Advanced Programming', $response['challenge']['challenge']);
        $challengeId = $response['challenge']['id'];

        // 3. List challenges
        $client->request('GET', '/api/student/challenges');
        self::assertResponseIsSuccessful();
        $list = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $list);

        // 4. Update the challenge
        $client->request('PATCH', '/api/student/challenges/' . $challengeId, [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'semesterRecordId' => $semId,
            'challenge' => 'Updated Challenge',
            'plan' => 'Updated Plan',
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);
        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('Updated Challenge', $response['challenge']['challenge']);

        // 5. Delete the challenge
        $client->request('DELETE', '/api/student/challenges/' . $challengeId);
        self::assertResponseStatusCodeSame(200);

        // 6. Verify empty list
        $client->request('GET', '/api/student/challenges');
        $list = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(0, $list);
    }

    public function testStudentCannotManageOtherStudentsChallenges(): void
    {
        $client = $this->client;
        $this->seedUser('STD001', 'student1@example.com', 'secret123', UserRole::STUDENT);
        $this->seedUser('STD002', 'student2@example.com', 'secret123', UserRole::STUDENT);

        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $user1 = $entityManager->getRepository(User::class)->findOneBy(['email' => 'student1@example.com']);
        $user2 = $entityManager->getRepository(User::class)->findOneBy(['email' => 'student2@example.com']);

        $sem1 = (new \App\Entity\SemesterRecord())->setStudent($user1)->setSemester(1)->setAcademicYear(2021);
        $entityManager->persist($sem1);
        $challenge1 = (new \App\Entity\Challenge())
            ->setRecord($sem1)
            ->setChallenge('User 1 Challenge')
            ->setPlan('User 1 Plan');
        $entityManager->persist($challenge1);
        $entityManager->flush();

        // Login as User 2 and try to delete User 1's challenge
        $this->login($client, 'student2@example.com', 'secret123');
        $client->request('DELETE', '/api/student/challenges/' . $challenge1->getId());
        self::assertResponseStatusCodeSame(404);
    }

    private function login(KernelBrowser $client, string $email, string $password): void
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['identifier' => $user->getIdentifier(), 'password' => $password], JSON_THROW_ON_ERROR));

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
