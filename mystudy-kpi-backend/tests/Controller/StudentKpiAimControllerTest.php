<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\IntakeBatch;
use App\Entity\KpiRecord;
use App\Entity\KpiAim;
use App\Entity\SemesterRecord;
use App\Entity\CgpaRecord;
use App\Entity\User;
use App\Enum\KpiTargetSetBy;
use App\Enum\UserRole;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class StudentKpiAimControllerTest extends WebTestCase
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

    public function testStudentCanGetAndUpdateAim(): void
    {
        $client = $this->client;

        $this->seedUser('STD100', 'student@example.com', 'secret123', UserRole::STUDENT);
        $this->seedUser('LEC100', 'lecturer@example.com', 'secret123', UserRole::LECTURER);

        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);

        $batch = (new IntakeBatch())
            ->setName('Batch 2023')
            ->setStartYear(2023)
            ->setIsActive(true);
        $entityManager->persist($batch);
        $entityManager->flush();

        /** @var User $student */
        $student = $entityManager->getRepository(User::class)->findOneBy(['email' => 'student@example.com']);
        /** @var User $lecturer */
        $lecturer = $entityManager->getRepository(User::class)->findOneBy(['email' => 'lecturer@example.com']);

        $student->setIntakeBatch($batch);
        $entityManager->persist($student);

        $semester = (new SemesterRecord())
            ->setStudent($student)
            ->setSemester(2)
            ->setAcademicYear(2024);

        $cgpaRecord = (new CgpaRecord())
            ->setRecord($semester)
            ->setGpa('3.42');

        $activityRecord = (new KpiRecord())
            ->setRecord($semester)
            ->setType('activity')
            ->setTitle('Faculty Activity')
            ->setLevel(0);

        $competitionRecord = (new KpiRecord())
            ->setRecord($semester)
            ->setType('competition')
            ->setTitle('National Competition')
            ->setLevel(3);

        $certificateRecord = (new KpiRecord())
            ->setRecord($semester)
            ->setType('certification')
            ->setTitle('Professional Cert')
            ->setCategory(0);

        $entityManager->persist($semester);
        $entityManager->persist($cgpaRecord);
        $entityManager->persist($activityRecord);
        $entityManager->persist($competitionRecord);
        $entityManager->persist($certificateRecord);

        $lecturerAim = (new KpiAim())
            ->setStudent($student)
            ->setLecturer($lecturer)
            ->setBatch($batch)
            ->setTargetSetBy(KpiTargetSetBy::LECTURER)
            ->setCgpaTarget('3.50')
            ->setActivityTargets($this->defaultLevelTargets(2))
            ->setCompetitionTargets($this->defaultLevelTargets(1))
            ->setCertificateTargets($this->defaultCertificateTargets(1));

        $facultyAim = (new KpiAim())
            ->setStudent(null)
            ->setLecturer(null)
            ->setBatch($batch)
            ->setTargetSetBy(KpiTargetSetBy::FACULTY)
            ->setCgpaTarget('3.30')
            ->setActivityTargets($this->defaultLevelTargets(1))
            ->setCompetitionTargets($this->defaultLevelTargets(0))
            ->setCertificateTargets($this->defaultCertificateTargets(0));

        $entityManager->persist($lecturerAim);
        $entityManager->persist($facultyAim);
        $entityManager->flush();

        $this->login($client, 'student@example.com', 'secret123');

        $client->request('GET', '/api/student/kpi-aim');
        self::assertResponseIsSuccessful();

        $response = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertNull($response['personal']);
        self::assertSame('lecturer', $response['lecturer']['sourceType']);
        self::assertSame('faculty', $response['batch']['sourceType']);
        self::assertSame('3.50', $response['lecturer']['cgpa']);
        self::assertSame('3.42', $response['actual']['cgpa']);
        self::assertSame(1, $response['actual']['activities']['faculty']);
        self::assertSame(1, $response['actual']['competitions']['national']);
        self::assertSame(1, $response['actual']['certificates']['professional']);

        $client->request('PUT', '/api/student/kpi-aim', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'cgpa' => '3.80',
            'activities' => [
                'faculty' => 2,
                'university' => 2,
                'local' => 1,
                'national' => 1,
                'international' => 0,
            ],
            'competitions' => [
                'faculty' => 1,
                'university' => 1,
                'local' => 1,
                'national' => 0,
                'international' => 0,
            ],
            'certificates' => [
                'professional' => 1,
                'technical' => 0,
            ],
        ], JSON_THROW_ON_ERROR));

        self::assertResponseIsSuccessful();
        $updated = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('KPI aim updated.', $updated['message']);
        self::assertSame('personal', $updated['aim']['personal']['sourceType']);
        self::assertSame('3.80', $updated['aim']['personal']['cgpa']);

        $client->request('GET', '/api/student/kpi-aim');
        self::assertResponseIsSuccessful();

        $latest = json_decode($client->getResponse()->getContent() ?: '', true, 512, JSON_THROW_ON_ERROR);
        self::assertSame('3.80', $latest['personal']['cgpa']);
        self::assertSame('3.50', $latest['lecturer']['cgpa']);
    }

    public function testStudentAimUpdateValidatesPayload(): void
    {
        $client = $this->client;
        $this->seedUser('STD101', 'student2@example.com', 'secret123', UserRole::STUDENT);
        $this->login($client, 'student2@example.com', 'secret123');

        $client->request('PUT', '/api/student/kpi-aim', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'cgpa' => '5.00',
            'activities' => ['faculty' => 1],
            'competitions' => ['faculty' => 1],
            'certificates' => ['professional' => 1],
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(422);
    }

    private function defaultLevelTargets(int $base): array
    {
        return [
            'faculty' => $base,
            'university' => $base,
            'local' => $base,
            'national' => $base,
            'international' => $base,
        ];
    }

    private function defaultCertificateTargets(int $base): array
    {
        return [
            'professional' => $base,
            'technical' => $base,
        ];
    }

    private function login(KernelBrowser $client, string $email, string $password): void
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'identifier' => $user->getIdentifier(),
            'password' => $password,
        ], JSON_THROW_ON_ERROR));

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
