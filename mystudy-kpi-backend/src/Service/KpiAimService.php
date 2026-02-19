<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\KpiAimUpdateDto;
use App\Entity\KpiAim;
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
        $aim = $this->kpiAimRepository->findLatestByStudentAndTargetSetBy($student, KpiTargetSetBy::PERSONAL);

        if (null === $aim) {
            $aim = (new KpiAim())
                ->setStudent($student)
                ->setBatch($student->getIntakeBatch())
                ->setLecturer(null)
                ->setTargetSetBy(KpiTargetSetBy::PERSONAL);
        }

        $aim
            ->setCgpaTarget($dto->cgpa)
            ->setActivityTargets($dto->activities)
            ->setCompetitionTargets($dto->competitions)
            ->setCertificateTargets($dto->certificates);

        $this->entityManager->persist($aim);
        $this->entityManager->flush();

        return $aim;
    }
}
