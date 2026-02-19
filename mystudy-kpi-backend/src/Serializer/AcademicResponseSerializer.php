<?php

declare(strict_types=1);

namespace App\Serializer;

use App\Entity\SemesterRecord;

final class AcademicResponseSerializer
{
    public function serialize(SemesterRecord $record): array
    {
        return [
            'id' => $record->getId(),
            'semester' => $record->getSemester(),
            'academicYear' => $record->getAcademicYear(),
            'academicYearString' => $record->getAcademicYearString(),
            'termString' => sprintf('%d-%s', $record->getSemester(), $record->getAcademicYearString()),
            'isShortSemester' => $record->getSemester() === 3,
            'gpa' => $record->getCgpaRecord()?->getGpa(),
        ];
    }

    /**
     * @param SemesterRecord[] $records
     */
    public function serializeCollection(array $records): array
    {
        $result = [];
        foreach ($records as $record) {
            $result[] = $this->serialize($record);
        }

        return $result;
    }
}
