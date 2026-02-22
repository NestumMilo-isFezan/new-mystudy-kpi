<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\CgpaRecordDto;
use App\Dto\SemesterRecordDto;
use App\Entity\CgpaRecord;
use App\Entity\SemesterRecord;
use App\Entity\User;
use App\Enum\SortableAcademicColumn;
use App\Exception\NotFoundException;
use App\Repository\SemesterRecordRepository;
use Doctrine\ORM\EntityManagerInterface;

class AcademicService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly SemesterRecordRepository $semesterRecordRepository,
    ) {
    }

    /**
     * @return SemesterRecord[]
     */
    public function listRecords(User $student): array
    {
        $records = $this->semesterRecordRepository->findBy(
            ['student' => $student],
            ['academicYear' => 'ASC', 'semester' => 'ASC']
        );

        if (empty($records)) {
            $records = $this->scaffoldStandardSemesters($student);
        }

        return $records;
    }

    /**
     * @return SemesterRecord[]
     */
    public function listRecordsSortedFiltered(
        User $student,
        SortableAcademicColumn $sortBy,
        string $sortDir,
        ?int $semester = null,
    ): array {
        if ($this->semesterRecordRepository->count(['student' => $student]) === 0) {
            $this->scaffoldStandardSemesters($student);
        }

        return $this->semesterRecordRepository->findByStudentSortedFiltered(
            $student,
            $sortBy,
            $sortDir,
            $semester,
        );
    }

    public function scaffoldStandardSemesters(User $student): array
    {
        $batch = $student->getIntakeBatch();
        if (null === $batch) {
            return [];
        }

        $startYear = $batch->getStartYear();
        $records = [];

        // 4 years, 2 semesters each
        for ($yearOffset = 0; $yearOffset < 4; $yearOffset++) {
            for ($semInYear = 1; $semInYear <= 2; $semInYear++) {
                $record = (new SemesterRecord())
                    ->setStudent($student)
                    ->setSemester($semInYear)
                    ->setAcademicYear($startYear + $yearOffset);

                $cgpaRecord = (new CgpaRecord())
                    ->setRecord($record)
                    ->setGpa(null);
                
                $record->setCgpaRecord($cgpaRecord);

                $this->entityManager->persist($record);
                $records[] = $record;
            }
        }

        $this->entityManager->flush();

        return $records;
    }

    public function upsertSemesterRecord(User $student, SemesterRecordDto $dto): SemesterRecord
    {
        $record = $this->semesterRecordRepository->findOneBy([
            'student' => $student,
            'semester' => $dto->semester,
            'academicYear' => $dto->academicYear,
        ]);

        if (null === $record) {
            $record = (new SemesterRecord())
                ->setStudent($student)
                ->setSemester($dto->semester)
                ->setAcademicYear($dto->academicYear);
        }

        $this->updateGpa($record, $dto->gpa);

        $this->entityManager->persist($record);
        $this->entityManager->flush();

        return $record;
    }

    public function updateGpaById(User $student, int $id, CgpaRecordDto $dto): SemesterRecord
    {
        $record = $this->semesterRecordRepository->findOneBy([
            'id' => $id,
            'student' => $student,
        ]);

        if (null === $record) {
            throw new NotFoundException('Semester record not found.');
        }

        $this->updateGpa($record, $dto->gpa);

        $this->entityManager->persist($record);
        $this->entityManager->flush();

        return $record;
    }

    private function updateGpa(SemesterRecord $record, ?string $gpa): void
    {
        $cgpaRecord = $record->getCgpaRecord();
        if (null === $cgpaRecord) {
            $cgpaRecord = (new CgpaRecord())->setRecord($record);
            $record->setCgpaRecord($cgpaRecord);
        }

        $cgpaRecord->setGpa($gpa);
    }
}
