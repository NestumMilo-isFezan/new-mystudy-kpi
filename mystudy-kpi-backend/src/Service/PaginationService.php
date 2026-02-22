<?php

declare(strict_types=1);

namespace App\Service;

use App\Enum\SortableMentorshipColumn;
use App\Enum\SortableKpiRecordColumn;
use App\Enum\SortableChallengeColumn;
use App\Enum\SortableAcademicColumn;
use App\Enum\SortableIntakeColumn;
use App\Enum\SortableUserColumn;
use Symfony\Component\HttpFoundation\Request;

final class PaginationService
{
    public const int DEFAULT_PAGE = 1;
    public const int DEFAULT_LIMIT = 25;
    public const int MAX_LIMIT = 100;

    /**
     * @return array{page: int, limit: int}
     */
    public function resolve(Request $request): array
    {
        $page = max(self::DEFAULT_PAGE, $request->query->getInt('page', self::DEFAULT_PAGE));
        $limit = $request->query->getInt('limit', self::DEFAULT_LIMIT);
        $limit = max(1, min($limit, self::MAX_LIMIT));

        return [
            'page' => $page,
            'limit' => $limit,
        ];
    }

    /**
     * Resolves sort parameters from the request, validating the column against the enum allowlist.
     *
     * @return array{sortBy: SortableUserColumn, sortDir: 'ASC'|'DESC'}
     */
    public function resolveUserSort(Request $request): array
    {
        $sortByRaw = $request->query->getString('sortBy', '');
        $sortDir = strtoupper($request->query->getString('sortDir', 'ASC'));

        if (!in_array($sortDir, ['ASC', 'DESC'], true)) {
            $sortDir = 'ASC';
        }

        return [
            'sortBy' => SortableUserColumn::fromRequest($sortByRaw !== '' ? $sortByRaw : null),
            'sortDir' => $sortDir === 'DESC' ? 'DESC' : 'ASC',
        ];
    }

    /**
     * @return array{sortBy: SortableMentorshipColumn, sortDir: 'ASC'|'DESC'}
     */
    public function resolveMentorshipSort(Request $request): array
    {
        $sortByRaw = $request->query->getString('sortBy', '');
        $sortDir = strtoupper($request->query->getString('sortDir', 'ASC'));

        if (!in_array($sortDir, ['ASC', 'DESC'], true)) {
            $sortDir = 'ASC';
        }

        return [
            'sortBy' => SortableMentorshipColumn::fromRequest($sortByRaw !== '' ? $sortByRaw : null),
            'sortDir' => $sortDir === 'DESC' ? 'DESC' : 'ASC',
        ];
    }

    /**
     * @return array{sortBy: SortableKpiRecordColumn, sortDir: 'ASC'|'DESC'}
     */
    public function resolveKpiRecordSort(Request $request): array
    {
        $sortByRaw = $request->query->getString('sortBy', '');
        $sortDir = strtoupper($request->query->getString('sortDir', 'ASC'));

        if (!in_array($sortDir, ['ASC', 'DESC'], true)) {
            $sortDir = 'ASC';
        }

        return [
            'sortBy' => SortableKpiRecordColumn::fromRequest($sortByRaw !== '' ? $sortByRaw : null),
            'sortDir' => $sortDir === 'DESC' ? 'DESC' : 'ASC',
        ];
    }

    /**
     * @return array{sortBy: SortableChallengeColumn, sortDir: 'ASC'|'DESC'}
     */
    public function resolveChallengeSort(Request $request): array
    {
        $sortByRaw = $request->query->getString('sortBy', '');
        $sortDir = strtoupper($request->query->getString('sortDir', 'ASC'));

        if (!in_array($sortDir, ['ASC', 'DESC'], true)) {
            $sortDir = 'ASC';
        }

        return [
            'sortBy' => SortableChallengeColumn::fromRequest($sortByRaw !== '' ? $sortByRaw : null),
            'sortDir' => $sortDir === 'DESC' ? 'DESC' : 'ASC',
        ];
    }

    /**
     * @return array{sortBy: SortableAcademicColumn, sortDir: 'ASC'|'DESC'}
     */
    public function resolveAcademicSort(Request $request): array
    {
        $sortByRaw = $request->query->getString('sortBy', '');
        $sortDir = strtoupper($request->query->getString('sortDir', 'ASC'));

        if (!in_array($sortDir, ['ASC', 'DESC'], true)) {
            $sortDir = 'ASC';
        }

        return [
            'sortBy' => SortableAcademicColumn::fromRequest($sortByRaw !== '' ? $sortByRaw : null),
            'sortDir' => $sortDir === 'DESC' ? 'DESC' : 'ASC',
        ];
    }

    /**
     * @return array{sortBy: SortableIntakeColumn, sortDir: 'ASC'|'DESC'}
     */
    public function resolveIntakeSort(Request $request): array
    {
        $sortByRaw = $request->query->getString('sortBy', '');
        $sortDir = strtoupper($request->query->getString('sortDir', 'ASC'));

        if (!in_array($sortDir, ['ASC', 'DESC'], true)) {
            $sortDir = 'ASC';
        }

        return [
            'sortBy' => SortableIntakeColumn::fromRequest($sortByRaw !== '' ? $sortByRaw : null),
            'sortDir' => $sortDir === 'DESC' ? 'DESC' : 'ASC',
        ];
    }

    /**
     * Resolves a specific filter value from the request query string.
     * Only returns the value if it is a non-empty string.
     */
    public function resolveFilter(Request $request, string $key): ?string
    {
        $value = $request->query->getString($key, '');

        return $value !== '' ? $value : null;
    }

    /**
     * @return array{page: int, limit: int, total: int, totalPages: int}
     */
    public function metadata(int $page, int $limit, int $total): array
    {
        $totalPages = max(1, (int) ceil($total / max(1, $limit)));

        return [
            'page' => max(1, $page),
            'limit' => max(1, $limit),
            'total' => max(0, $total),
            'totalPages' => $totalPages,
        ];
    }
}
