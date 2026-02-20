<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Entity\IntakeBatch;
use App\Entity\User;
use App\Enum\UserRole;
use App\Entity\Profile;
use App\Entity\Mentorship;
use App\Entity\Mentee;
use App\Entity\SemesterRecord;
use App\Enum\KpiTargetSetBy;
use App\Entity\KpiAim;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class MentorshipStudentDetailControllerTest extends WebTestCase
{
    private KernelBrowser $client;

    protected function setUp(): void
    {
        self::ensureKernelShutdown();
        $this->client = self::createClient();

        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);

        $metadata = $entityManager->getMetadataFactory()->getAllMetadata();
        $schemaTool = new SchemaTool($entityManager);
        $schemaTool->dropDatabase();
        $schemaTool->createSchema($metadata);
    }

    public function testLecturerCanAccessMenteeOverview(): void
    {
        $lecturer = $this->seedUser('LEC001', 'lec001@example.com', 'secret123', UserRole::LECTURER);
        $batch = $this->seedIntakeBatch(2024);
        $student = $this->seedStudent('STD001', 'std001@example.com', $batch);
        $this->assignMentee($lecturer, $batch, $student);

        $this->login($this->client, 'LEC001', 'secret123');
        $this->client->request('GET', sprintf('/api/lecturer/mentorships/students/%s/overview', $student->getId()));
        self::assertResponseStatusCodeSame(200);
        
        $data = json_decode($this->client->getResponse()->getContent() ?: '', true);
        self::assertSame('STD001', $data['student']['identifier']);
    }

    public function testLecturerCannotAccessNonMenteeOverview(): void
    {
        $this->seedUser('LEC001', 'lec001@example.com', 'secret123', UserRole::LECTURER);
        $batch = $this->seedIntakeBatch(2024);
        $student = $this->seedStudent('STD001', 'std001@example.com', $batch);
        // Not assigned

        $this->login($this->client, 'LEC001', 'secret123');
        $this->client->request('GET', sprintf('/api/lecturer/mentorships/students/%s/overview', $student->getId()));
        self::assertResponseStatusCodeSame(404);
    }

    public function testAdminCanListAllMenteesAndAddNotes(): void
    {
        $lecturer = $this->seedUser('LEC002', 'lec002@example.com', 'secret123', UserRole::LECTURER);
        $batch = $this->seedIntakeBatch(2024);
        $student = $this->seedStudent('STD002', 'std002@example.com', $batch);
        $this->assignMentee($lecturer, $batch, $student);

        $this->seedUser('STAFF001', 'staff001@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STAFF001', 'secret123');

        // List
        $this->client->request('GET', '/api/admin/mentorships/mentees');
        self::assertResponseStatusCodeSame(200);
        $list = json_decode($this->client->getResponse()->getContent() ?: '', true);
        self::assertCount(1, $list);
        self::assertSame('STD002', $list[0]['student']['identifier']);

        // Update Notes
        $this->client->request('PATCH', sprintf('/api/admin/mentorships/mentees/%s/notes', $student->getId()), [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['notes' => 'Good progress.']));
        self::assertResponseStatusCodeSame(200);

        // Verify notes updated
        $this->client->request('GET', '/api/admin/mentorships/mentees');
        $list = json_decode($this->client->getResponse()->getContent() ?: '', true);
        self::assertSame('Good progress.', $list[0]['notes']);
    }

    public function testAdminCanCreateStandardKpiAim(): void
    {
        $batch = $this->seedIntakeBatch(2025);
        $this->seedUser('STAFF002', 'staff002@example.com', 'secret123', UserRole::STAFF);
        $this->login($this->client, 'STAFF002', 'secret123');

        $aimData = [
            'cgpa' => '3.50',
            'activities' => ['faculty' => 2, 'university' => 1, 'local' => 0, 'national' => 0, 'international' => 0],
            'competitions' => ['faculty' => 1, 'university' => 0, 'local' => 0, 'national' => 0, 'international' => 0],
            'certificates' => ['professional' => 1, 'technical' => 0],
        ];

        $this->client->request('POST', sprintf('/api/admin/mentorships/standard-aims/%d', $batch->getId()), [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($aimData));
        self::assertResponseStatusCodeSame(200);

        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $aim = $entityManager->getRepository(KpiAim::class)->findOneBy(['batch' => $batch, 'targetSetBy' => KpiTargetSetBy::FACULTY]);
        self::assertNotNull($aim);
        self::assertSame('3.50', $aim->getCgpaTarget());
    }

    private function login(KernelBrowser $client, string $identifier, string $password): void
    {
        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode(['identifier' => $identifier, 'password' => $password], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(200);
    }

    private function seedUser(string $identifier, string $email, string $password, UserRole $role): User
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
        
        $profile = (new Profile())
            ->setUser($user)
            ->setFirstName('Test')
            ->setLastName($identifier);
        $user->setProfile($profile);

        $entityManager->persist($user);
        $entityManager->persist($profile);
        $entityManager->flush();

        return $user;
    }

    private function seedStudent(string $identifier, string $email, IntakeBatch $batch): User
    {
        $user = $this->seedUser($identifier, $email, 'secret123', UserRole::STUDENT);
        $user->setIntakeBatch($batch);
        
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $entityManager->flush();

        return $user;
    }

    private function seedIntakeBatch(int $startYear): IntakeBatch
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);

        $batch = (new IntakeBatch())
            ->setStartYear($startYear)
            ->setName(sprintf('Batch %d', $startYear));
        $entityManager->persist($batch);
        $entityManager->flush();

        return $batch;
    }

    private function assignMentee(User $lecturer, IntakeBatch $batch, User $student): void
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = self::getContainer()->get(EntityManagerInterface::class);

        $mentorship = (new Mentorship())
            ->setLecturer($lecturer)
            ->setIntakeBatch($batch);
        
        $mentee = (new Mentee())
            ->setMentorship($mentorship)
            ->setStudent($student);
        
        $mentorship->addMentee($mentee);
        
        $entityManager->persist($mentorship);
        $entityManager->persist($mentee);
        $entityManager->flush();
    }
}
