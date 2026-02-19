<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\IntakeBatch;
use App\Exception\DuplicateIntakeBatchException;
use App\Repository\IntakeBatchRepository;
use Doctrine\ORM\EntityManagerInterface;

final class IntakeBatchService
{
    public function __construct(
        private readonly IntakeBatchRepository $intakeBatchRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function createBatch(int $startYear): IntakeBatch
    {
        if ($this->intakeBatchRepository->findOneByStartYear($startYear)) {
            throw new DuplicateIntakeBatchException();
        }

        $intakeBatch = (new IntakeBatch())
            ->setStartYear($startYear)
            ->setName($this->buildBatchName($startYear))
            ->setIsActive(true);

        $this->entityManager->persist($intakeBatch);
        $this->entityManager->flush();

        return $intakeBatch;
    }

    /** @return IntakeBatch[] */
    public function findAllBatches(): array
    {
        return $this->intakeBatchRepository->findBy([], ['startYear' => 'ASC']);
    }

    public function toggleBatchStatus(int $id): IntakeBatch
    {
        $batch = $this->intakeBatchRepository->find($id);

        if (!$batch) {
            throw new \InvalidArgumentException('Intake batch not found.');
        }

        $batch->setIsActive(!$batch->isActive());
        $this->entityManager->flush();

        return $batch;
    }

    public function updateBatch(int $id, int $startYear): IntakeBatch
    {
        $batch = $this->intakeBatchRepository->find($id);

        if (!$batch) {
            throw new \InvalidArgumentException('Intake batch not found.');
        }

        $existingBatch = $this->intakeBatchRepository->findOneByStartYear($startYear);
        if ($existingBatch && $existingBatch->getId() !== $id) {
            throw new DuplicateIntakeBatchException();
        }

        $batch
            ->setStartYear($startYear)
            ->setName($this->buildBatchName($startYear));
        $this->entityManager->flush();

        return $batch;
    }

    public function deleteBatch(int $id): void
    {
        $batch = $this->intakeBatchRepository->find($id);

        if (!$batch) {
            throw new \InvalidArgumentException('Intake batch not found.');
        }

        $this->entityManager->remove($batch);
        $this->entityManager->flush();
    }

    private function buildBatchName(int $startYear): string
    {
        $startYearSuffix = $startYear % 100;
        $endYearSuffix = ($startYear + 1) % 100;

        return sprintf('%02d/%02d', $startYearSuffix, $endYearSuffix);
    }
}
