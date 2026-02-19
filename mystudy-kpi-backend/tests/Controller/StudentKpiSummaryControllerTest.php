<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\User;
use App\Enum\UserRole;
use App\Enum\KpiTargetSetBy;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class StudentKpiSummaryControllerTest extends WebTestCase
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

    public function testStudentCanGetKpiSummary(): void
    {
        $client = $this->client;
        $this->seedUser('STD001', 'student1@example.com', 'secret123', UserRole::STUDENT);
        $this->login($client, 'student1@example.com', 'secret123');

        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => 'student1@example.com']);

        // 1. Setup Targets
        $aim = (new \App\Entity\KpiAim())
            ->setStudent($user)
            ->setTargetSetBy(KpiTargetSetBy::PERSONAL)
            ->setCgpaTarget('3.50')
            ->setActivityTargets([
                'faculty' => 2,
                'university' => 1,
                'local' => 0,
                'national' => 0,
                'international' => 0
            ])
            ->setCompetitionTargets([
                'faculty' => 0,
                'university' => 0,
                'local' => 0,
                'national' => 0,
                'international' => 0
            ])
            ->setCertificateTargets([
                'professional' => 1,
                'technical' => 0
            ]);
        $entityManager->persist($aim);

        // 2. Setup Academic Record with GPA
        $sem = (new \App\Entity\SemesterRecord())->setStudent($user)->setSemester(1)->setAcademicYear(2021);
        $entityManager->persist($sem);
        $cgpa = (new \App\Entity\CgpaRecord())->setRecord($sem)->setGpa('3.80');
        $entityManager->persist($cgpa);

        // 3. Setup some KPI Records
        $kpi1 = (new \App\Entity\KpiRecord())->setRecord($sem)->setType('activity')->setTitle('Act 1')->setLevel(0); // Faculty
        $kpi2 = (new \App\Entity\KpiRecord())->setRecord($sem)->setType('activity')->setTitle('Act 2')->setLevel(0); // Faculty
        $entityManager->persist($kpi1);
        $entityManager->persist($kpi2);

        $entityManager->flush();

        // 4. Request Summary
        $client->request('GET', '/api/student/kpi-summary');
        self::assertResponseIsSuccessful();
        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);

        // 5. Assert Actuals
        self::assertSame('3.80', $response['actual']['cgpa']);
        self::assertSame(2, $response['actual']['activities']['faculty']);
        self::assertSame(0, $response['actual']['activities']['university']);

        // 6. Assert Gaps
        self::assertEquals(0.3, $response['gaps']['cgpa']); // 3.80 - 3.50
        self::assertSame(0, $response['gaps']['activities']['faculty']); // 2 - 2
        self::assertSame(-1, $response['gaps']['activities']['university']); // 0 - 1
        self::assertSame('personal', $response['targetSource']);
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
