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

final class StudentKpiRecordControllerTest extends WebTestCase
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

    public function testStudentCanManageKpiRecords(): void
    {
        $client = $this->client;
        $this->seedUser('STD001', 'student1@example.com', 'secret123', UserRole::STUDENT);
        $this->login($client, 'student1@example.com', 'secret123');

        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => 'student1@example.com']);

        // 1. Create a semester record first (scaffolded manually here for test)
        $sem = (new \App\Entity\SemesterRecord())->setStudent($user)->setSemester(1)->setAcademicYear(2021);
        $entityManager->persist($sem);
        $entityManager->flush();
        $semId = $sem->getId();

        // 2. Create a KPI record (Activity)
        $client->request('POST', '/api/student/kpi-records', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'semesterRecordId' => $semId,
            'type' => 'activity',
            'title' => 'Dean List Talk',
            'description' => 'Attended talk by Dean',
            'level' => 0, // Faculty
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(201);
        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('KPI record created.', $response['message']);
        self::assertSame('Dean List Talk', $response['record']['title']);
        self::assertSame(0, $response['record']['level']);
        $recordId = $response['record']['id'];

        // 3. List records
        $client->request('GET', '/api/student/kpi-records');
        self::assertResponseIsSuccessful();
        $list = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(1, $list);

        // 4. Update the record (Change to Competition)
        $client->request('PATCH', '/api/student/kpi-records/' . $recordId, [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'type' => 'competition',
            'title' => 'Hackathon 2024',
            'level' => 3, // National
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(200);
        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('competition', $response['record']['type']);
        self::assertSame(3, $response['record']['level']);

        // 5. Delete the record
        $client->request('DELETE', '/api/student/kpi-records/' . $recordId);
        self::assertResponseStatusCodeSame(200);

        // 6. Verify empty list
        $client->request('GET', '/api/student/kpi-records');
        $list = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertCount(0, $list);
    }

    public function testStudentCannotManageOtherStudentsRecords(): void
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
        $record1 = (new \App\Entity\KpiRecord())->setRecord($sem1)->setType('activity')->setTitle('S1 Record');
        $entityManager->persist($record1);
        $entityManager->flush();

        // Login as User 2 and try to delete User 1's record
        $this->login($client, 'student2@example.com', 'secret123');
        $client->request('DELETE', '/api/student/kpi-records/' . $record1->getId());
        self::assertResponseStatusCodeSame(404);
    }

    private function login(KernelBrowser $client, string $email, string $password): void
    {
        // Fetch identifier for the email
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
