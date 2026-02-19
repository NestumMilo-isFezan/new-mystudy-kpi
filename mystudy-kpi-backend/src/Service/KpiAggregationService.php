<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\User;
use App\Enum\KpiTargetSetBy;
use App\Repository\KpiAimRepository;
use App\Repository\KpiRecordRepository;
use App\Repository\SemesterRecordRepository;

class KpiAggregationService
{
    public function __construct(
        private readonly KpiRecordRepository $kpiRecordRepository,
        private readonly SemesterRecordRepository $semesterRecordRepository,
        private readonly KpiAimRepository $kpiAimRepository,
    ) {
    }

    public function buildSummary(User $student): array
    {
        $actual = $this->buildActual($student);
        
        // Find best target to compare against (Personal > Lecturer > Batch)
        $target = $this->kpiAimRepository->findLatestByStudentAndTargetSetBy($student, KpiTargetSetBy::PERSONAL)
            ?? $this->kpiAimRepository->findLatestByStudentAndTargetSetBy($student, KpiTargetSetBy::LECTURER);
        
        if (null === $target && null !== $student->getIntakeBatch()) {
            $target = $this->kpiAimRepository->findLatestByBatchAndTargetSetBy($student->getIntakeBatch(), KpiTargetSetBy::FACULTY);
        }

        $gaps = [
            'cgpa' => null,
            'activities' => [],
            'competitions' => [],
            'certificates' => [],
        ];

        if (null !== $target) {
            if (null !== $actual['cgpa']) {
                $gaps['cgpa'] = round((float) $actual['cgpa'] - (float) $target->getCgpaTarget(), 2);
            }
            
            foreach ($actual['activities'] as $level => $count) {
                $targetCount = $target->getActivityTargets()[$level] ?? 0;
                $gaps['activities'][$level] = $count - $targetCount;
            }

            foreach ($actual['competitions'] as $level => $count) {
                $targetCount = $target->getCompetitionTargets()[$level] ?? 0;
                $gaps['competitions'][$level] = $count - $targetCount;
            }

            foreach ($actual['certificates'] as $cat => $count) {
                $targetCount = $target->getCertificateTargets()[$cat] ?? 0;
                $gaps['certificates'][$cat] = $count - $targetCount;
            }
        }

        return [
            'actual' => $actual,
            'gaps' => $gaps,
            'targetSource' => $target ? $target->getTargetSetBy()->label() : null,
        ];
    }

    public function buildActual(User $student): array
    {
        $actual = [
            'cgpa' => null,
            'activities' => [
                'faculty' => 0,
                'university' => 0,
                'local' => 0,
                'national' => 0,
                'international' => 0,
            ],
            'competitions' => [
                'faculty' => 0,
                'university' => 0,
                'local' => 0,
                'national' => 0,
                'international' => 0,
            ],
            'certificates' => [
                'professional' => 0,
                'technical' => 0,
            ],
        ];

        $latestSemester = $this->semesterRecordRepository->findLatestWithCgpaByStudent($student);
        if (null !== $latestSemester && null !== $latestSemester->getCgpaRecord()) {
            $actual['cgpa'] = $latestSemester->getCgpaRecord()->getGpa();
        }

        $records = $this->kpiRecordRepository->findByStudent($student);
        foreach ($records as $record) {
            if ('activity' === $record->getType()) {
                $levelKey = $this->mapLevelKey($record->getLevel());
                if (null !== $levelKey) {
                    ++$actual['activities'][$levelKey];
                }
                continue;
            }

            if ('competition' === $record->getType()) {
                $levelKey = $this->mapLevelKey($record->getLevel());
                if (null !== $levelKey) {
                    ++$actual['competitions'][$levelKey];
                }
                continue;
            }

            if ('certification' === $record->getType()) {
                $categoryKey = $this->mapCategoryKey($record->getCategory());
                if (null !== $categoryKey) {
                    ++$actual['certificates'][$categoryKey];
                }
            }
        }

        return $actual;
    }

    private function mapLevelKey(?int $level): ?string
    {
        return match ($level) {
            0 => 'faculty',
            1 => 'university',
            2 => 'local',
            3 => 'national',
            4 => 'international',
            default => null,
        };
    }

    private function mapCategoryKey(?int $category): ?string
    {
        return match ($category) {
            0 => 'professional',
            1 => 'technical',
            default => null,
        };
    }
}
