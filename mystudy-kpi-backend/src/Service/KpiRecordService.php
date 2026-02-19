<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\KpiRecordDto;
use App\Entity\KpiRecord;
use App\Entity\User;
use App\Repository\KpiRecordRepository;
use App\Repository\SemesterRecordRepository;
use Doctrine\ORM\EntityManagerInterface;

class KpiRecordService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly KpiRecordRepository $kpiRecordRepository,
        private readonly SemesterRecordRepository $semesterRecordRepository,
    ) {
    }

    /**
     * @return KpiRecord[]
     */
    public function listRecords(User $student): array
    {
        return $this->kpiRecordRepository->findByStudent($student);
    }

    public function createRecord(User $student, KpiRecordDto $dto): KpiRecord
    {
        if (null === $dto->semesterRecordId) {
            throw new \InvalidArgumentException('Semester record ID is required.');
        }

        $semesterRecord = $this->semesterRecordRepository->findOneBy([
            'id' => $dto->semesterRecordId,
            'student' => $student,
        ]);

        if (null === $semesterRecord) {
            throw new \InvalidArgumentException('Semester record not found.');
        }

        $record = (new KpiRecord())->setRecord($semesterRecord);
        $this->populateRecord($record, $dto);

        $this->entityManager->persist($record);
        $this->entityManager->flush();

        return $record;
    }

    public function updateRecord(User $student, int $id, KpiRecordDto $dto): KpiRecord
    {
        $record = $this->kpiRecordRepository->find($id);

        if (null === $record || $record->getRecord()->getStudent() !== $student) {
            throw new \InvalidArgumentException('KPI record not found.');
        }

        $this->populateRecord($record, $dto);

        $this->entityManager->persist($record);
        $this->entityManager->flush();

        return $record;
    }

    public function deleteRecord(User $student, int $id): void
    {
        $record = $this->kpiRecordRepository->find($id);

        if (null === $record || $record->getRecord()->getStudent() !== $student) {
            throw new \InvalidArgumentException('KPI record not found.');
        }

        $this->entityManager->remove($record);
        $this->entityManager->flush();
    }

    private function populateRecord(KpiRecord $record, KpiRecordDto $dto): void
    {
        $record->setType($dto->type);
        $record->setTitle($dto->title);
        $record->setDescription($dto->description);
        $record->setTags($dto->tags);
        $record->setNotes($dto->notes);

        if ($dto->type === 'certification') {
            $record->setCategory($dto->category);
            $record->setLevel(null);
        } else {
            $record->setLevel($dto->level);
            $record->setCategory(null);
        }
    }
}
