<?php

declare(strict_types=1);

namespace App\Entity;

use App\Enum\KpiTargetSetBy;
use App\Repository\KpiAimRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: KpiAimRepository::class)]
#[ORM\Table(name: 'kpi_aim')]
class KpiAim
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'smallint')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'student_id', referencedColumnName: 'id', nullable: true, onDelete: 'CASCADE')]
    private ?User $student = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'lecturer_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?User $lecturer = null;

    #[ORM\ManyToOne(targetEntity: IntakeBatch::class)]
    #[ORM\JoinColumn(name: 'batch_id', referencedColumnName: 'id', nullable: true, onDelete: 'CASCADE')]
    private ?IntakeBatch $batch = null;

    #[ORM\Column(name: 'target_set_by', type: 'smallint', enumType: KpiTargetSetBy::class)]
    private KpiTargetSetBy $targetSetBy = KpiTargetSetBy::PERSONAL;

    #[ORM\Column(type: 'decimal', precision: 3, scale: 2)]
    private string $cgpaTarget;

    #[ORM\Column(type: 'json')]
    private array $activityTargets; // Keys: faculty, university, local, national, international

    #[ORM\Column(type: 'json')]
    private array $competitionTargets; // Keys: faculty, university, local, national, international

    #[ORM\Column(type: 'json')]
    private array $certificateTargets; // Keys: professional, technical

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStudent(): ?User
    {
        return $this->student;
    }

    public function setStudent(?User $student): self
    {
        $this->student = $student;
        return $this;
    }

    public function getLecturer(): ?User
    {
        return $this->lecturer;
    }

    public function setLecturer(?User $lecturer): self
    {
        $this->lecturer = $lecturer;
        return $this;
    }

    public function getBatch(): ?IntakeBatch
    {
        return $this->batch;
    }

    public function setBatch(?IntakeBatch $batch): self
    {
        $this->batch = $batch;
        return $this;
    }

    public function getTargetSetBy(): KpiTargetSetBy
    {
        return $this->targetSetBy;
    }

    public function setTargetSetBy(KpiTargetSetBy $targetSetBy): self
    {
        $this->targetSetBy = $targetSetBy;

        return $this;
    }

    public function getCgpaTarget(): string
    {
        return $this->cgpaTarget;
    }

    public function setCgpaTarget(string $cgpaTarget): self
    {
        $this->cgpaTarget = $cgpaTarget;
        return $this;
    }

    public function getActivityTargets(): array
    {
        return $this->activityTargets;
    }

    public function setActivityTargets(array $activityTargets): self
    {
        $this->activityTargets = $activityTargets;
        return $this;
    }

    public function getCompetitionTargets(): array
    {
        return $this->competitionTargets;
    }

    public function setCompetitionTargets(array $competitionTargets): self
    {
        $this->competitionTargets = $competitionTargets;
        return $this;
    }

    public function getCertificateTargets(): array
    {
        return $this->certificateTargets;
    }

    public function setCertificateTargets(array $certificateTargets): self
    {
        $this->certificateTargets = $certificateTargets;
        return $this;
    }
}
