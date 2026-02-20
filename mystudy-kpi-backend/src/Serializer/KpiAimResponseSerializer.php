<?php

declare(strict_types=1);

namespace App\Serializer;

use App\Entity\KpiAim;
use App\Enum\KpiTargetSetBy;

final class KpiAimResponseSerializer
{
    public function serialize(?KpiAim $personal, ?KpiAim $lecturer, ?KpiAim $faculty, array $actual): array
    {
        return [
            'personal' => $this->serializePersonal($personal),
            'lecturer' => $this->serializeLecturer($lecturer),
            'batch' => $this->serializeBatch($faculty),
            'actual' => $actual,
        ];
    }

    public function serializeSingle(?KpiAim $aim): ?array
    {
        if (null === $aim) {
            return null;
        }

        return [
            'id' => $aim->getId(),
            'targetSetBy' => $aim->getTargetSetBy()->label(),
            'cgpa' => $aim->getCgpaTarget(),
            'activities' => $this->normalizeLevelTargets($aim->getActivityTargets()),
            'competitions' => $this->normalizeLevelTargets($aim->getCompetitionTargets()),
            'certificates' => $this->normalizeCertificateTargets($aim->getCertificateTargets()),
        ];
    }

    private function serializePersonal(?KpiAim $aim): ?array
    {
        if (null === $aim) {
            return null;
        }

        return [
            'sourceType' => KpiTargetSetBy::PERSONAL->label(),
            'cgpa' => $aim->getCgpaTarget(),
            'activities' => $this->normalizeLevelTargets($aim->getActivityTargets()),
            'competitions' => $this->normalizeLevelTargets($aim->getCompetitionTargets()),
            'certificates' => $this->normalizeCertificateTargets($aim->getCertificateTargets()),
            'lastUpdated' => null,
        ];
    }

    private function serializeLecturer(?KpiAim $aim): ?array
    {
        if (null === $aim) {
            return null;
        }

        return [
            'sourceType' => KpiTargetSetBy::LECTURER->label(),
            'source' => $aim->getLecturer()?->getIdentifier() ?? 'Lecturer Target',
            'isCustomized' => true,
            'cgpa' => $aim->getCgpaTarget(),
            'activities' => $this->normalizeLevelTargets($aim->getActivityTargets()),
            'competitions' => $this->normalizeLevelTargets($aim->getCompetitionTargets()),
            'certificates' => $this->normalizeCertificateTargets($aim->getCertificateTargets()),
        ];
    }

    private function serializeBatch(?KpiAim $aim): ?array
    {
        if (null === $aim) {
            return null;
        }

        return [
            'sourceType' => KpiTargetSetBy::FACULTY->label(),
            'source' => $aim->getBatch()?->getName() ?? 'Faculty Standard',
            'cgpa' => $aim->getCgpaTarget(),
            'activities' => $this->normalizeLevelTargets($aim->getActivityTargets()),
            'competitions' => $this->normalizeLevelTargets($aim->getCompetitionTargets()),
            'certificates' => $this->normalizeCertificateTargets($aim->getCertificateTargets()),
        ];
    }

    private function normalizeLevelTargets(array $targets): array
    {
        return [
            'faculty' => (int) ($targets['faculty'] ?? 0),
            'university' => (int) ($targets['university'] ?? 0),
            'local' => (int) ($targets['local'] ?? 0),
            'national' => (int) ($targets['national'] ?? 0),
            'international' => (int) ($targets['international'] ?? 0),
        ];
    }

    private function normalizeCertificateTargets(array $targets): array
    {
        return [
            'professional' => (int) ($targets['professional'] ?? 0),
            'technical' => (int) ($targets['technical'] ?? 0),
        ];
    }
}
