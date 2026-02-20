<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\KpiAimUpdateDto;
use App\Entity\KpiAim;
use App\Entity\IntakeBatch;
use App\Entity\User;
use App\Enum\KpiTargetSetBy;
use App\Repository\KpiAimRepository;
use App\Serializer\KpiAimResponseSerializer;
use Doctrine\ORM\EntityManagerInterface;

class KpiAimService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly KpiAimRepository $kpiAimRepository,
        private readonly KpiAggregationService $kpiAggregationService,
        private readonly KpiAimResponseSerializer $serializer,
    ) {
    }

    public function getAims(User $student): array
    {
        $personal = $this->kpiAimRepository->findLatestByStudentAndTargetSetBy($student, KpiTargetSetBy::PERSONAL);
        $lecturer = $this->kpiAimRepository->findLatestByStudentAndTargetSetBy($student, KpiTargetSetBy::LECTURER);

        $batch = null;
        if (null !== $student->getIntakeBatch()) {
            $batch = $this->kpiAimRepository->findLatestByBatchAndTargetSetBy($student->getIntakeBatch(), KpiTargetSetBy::FACULTY);
        }

        return $this->serializer->serialize($personal, $lecturer, $batch, $this->kpiAggregationService->buildActual($student));
    }

    public function updatePersonalAim(User $student, KpiAimUpdateDto $dto): KpiAim
    {
        return $this->updateAim($student, null, $student->getIntakeBatch(), KpiTargetSetBy::PERSONAL, $dto);
    }

    public function updateMenteeAim(User $student, User $lecturer, KpiAimUpdateDto $dto): KpiAim
    {
        return $this->updateAim($student, $lecturer, $student->getIntakeBatch(), KpiTargetSetBy::LECTURER, $dto);
    }

    public function updateStandardAim(IntakeBatch $batch, User $staff, KpiAimUpdateDto $dto): KpiAim
    {
        return $this->updateAim(null, $staff, $batch, KpiTargetSetBy::FACULTY, $dto);
    }

    public function getBatchAim(IntakeBatch $batch): ?array
    {
        $aim = $this->kpiAimRepository->findLatestByBatchAndTargetSetBy($batch, KpiTargetSetBy::FACULTY);
        
        return $this->serializer->serializeSingle($aim);
    }

    private function updateAim(?User $student, ?User $lecturer, ?IntakeBatch $batch, KpiTargetSetBy $targetSetBy, KpiAimUpdateDto $dto): KpiAim
    {
        $aim = null;
        if ($student) {
            $aim = $this->kpiAimRepository->findLatestByStudentAndTargetSetBy($student, $targetSetBy);
        } elseif ($batch) {
            $aim = $this->kpiAimRepository->findLatestByBatchAndTargetSetBy($batch, $targetSetBy);
        }

        if (null === $aim) {
            $aim = (new KpiAim())
                ->setStudent($student)
                ->setBatch($batch)
                ->setLecturer($lecturer)
                ->setTargetSetBy($targetSetBy);
        }

        $aim
            ->setLecturer($lecturer) // Always update the latest lecturer/staff who edited it
            ->setCgpaTarget($dto->cgpa)
            ->setActivityTargets($dto->activities)
            ->setCompetitionTargets($dto->competitions)
            ->setCertificateTargets($dto->certificates);

        $this->entityManager->persist($aim);
        $this->entityManager->flush();

        return $aim;
    }
}
