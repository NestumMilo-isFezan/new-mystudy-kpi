<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\SemesterRecordRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SemesterRecordRepository::class)]
#[ORM\Table(name: 'semester_record')]
#[ORM\UniqueConstraint(name: 'uniq_student_semester_year', columns: ['student_id', 'semester', 'academic_year'])]
class SemesterRecord
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'bigint')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private User $student;

    #[ORM\Column(type: 'smallint')]
    private int $semester;

    #[ORM\Column(type: 'smallint')]
    private int $academicYear;

    #[ORM\OneToOne(mappedBy: 'record', targetEntity: CgpaRecord::class, cascade: ['persist', 'remove'])]
    private ?CgpaRecord $cgpaRecord = null;

    /** @var Collection<int, KpiRecord> */
    #[ORM\OneToMany(mappedBy: 'record', targetEntity: KpiRecord::class, cascade: ['persist', 'remove'])]
    private Collection $kpiRecords;

    public function __construct()
    {
        $this->kpiRecords = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStudent(): User
    {
        return $this->student;
    }

    public function setStudent(User $student): self
    {
        $this->student = $student;
        return $this;
    }

    public function getSemester(): int
    {
        return $this->semester;
    }

    public function setSemester(int $semester): self
    {
        $this->semester = $semester;
        return $this;
    }

    public function getAcademicYear(): int
    {
        return $this->academicYear;
    }

    public function setAcademicYear(int $academicYear): self
    {
        $this->academicYear = $academicYear;
        return $this;
    }

    public function getAcademicYearString(): string
    {
        return sprintf('%d/%d', $this->academicYear, $this->academicYear + 1);
    }

    public function getCgpaRecord(): ?CgpaRecord
    {
        return $this->cgpaRecord;
    }

    public function setCgpaRecord(?CgpaRecord $cgpaRecord): self
    {
        $this->cgpaRecord = $cgpaRecord;
        return $this;
    }

    /** @return Collection<int, KpiRecord> */
    public function getKpiRecords(): Collection
    {
        return $this->kpiRecords;
    }
}
