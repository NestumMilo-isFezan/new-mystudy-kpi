<?php

declare(strict_types=1);

namespace App\Serializer;

use App\Entity\KpiRecord;

final class KpiRecordResponseSerializer
{
    public function serialize(KpiRecord $record): array
    {
        return [
            'id' => $record->getId(),
            'type' => $record->getType(),
            'title' => $record->getTitle(),
            'description' => $record->getDescription(),
            'level' => $record->getLevel(),
            'category' => $record->getCategory(),
            'tags' => $record->getTags(),
            'notes' => $record->getNotes(),
            'semester' => [
                'id' => $record->getRecord()->getId(),
                'semester' => $record->getRecord()->getSemester(),
                'academicYear' => $record->getRecord()->getAcademicYear(),
                'termString' => sprintf('%d-%s', $record->getRecord()->getSemester(), $record->getRecord()->getAcademicYearString()),
            ],
        ];
    }

    /**
     * @param KpiRecord[] $records
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
