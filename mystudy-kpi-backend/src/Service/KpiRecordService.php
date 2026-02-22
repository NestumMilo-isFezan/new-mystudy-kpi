<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\KpiRecordDto;
use App\Entity\KpiRecord;
use App\Entity\User;
use App\Enum\SortableKpiRecordColumn;
use App\Exception\NotFoundException;
use App\Exception\ResourceRequiredException;
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

    /**
     * @return array{items: KpiRecord[], total: int}
     */
    public function listRecordsPage(
        User $student,
        int $page,
        int $limit,
        SortableKpiRecordColumn $sortBy,
        string $sortDir,
        ?string $type = null,
    ): array {
        return $this->kpiRecordRepository->findByStudentPaginated(
            $student,
            $page,
            $limit,
            $sortBy,
            $sortDir,
            $type,
        );
    }

    public function createRecord(User $student, KpiRecordDto $dto): KpiRecord
    {
        if (null === $dto->semesterRecordId) {
            throw new ResourceRequiredException('Semester record ID is required.');
        }

        $semesterRecord = $this->semesterRecordRepository->findOneBy([
            'id' => $dto->semesterRecordId,
            'student' => $student,
        ]);

        if (null === $semesterRecord) {
            throw new NotFoundException('Semester record not found.');
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
            throw new NotFoundException('KPI record not found.');
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
            throw new NotFoundException('KPI record not found.');
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
