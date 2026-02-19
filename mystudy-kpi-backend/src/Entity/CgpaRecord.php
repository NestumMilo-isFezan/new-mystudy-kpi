<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\CgpaRecordRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CgpaRecordRepository::class)]
#[ORM\Table(name: 'cgpa_record')]
class CgpaRecord
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'smallint')]
    private ?int $id = null;

    #[ORM\OneToOne(targetEntity: SemesterRecord::class, inversedBy: 'cgpaRecord')]
    #[ORM\JoinColumn(name: 'record_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private SemesterRecord $record;

    #[ORM\Column(type: 'decimal', precision: 3, scale: 2, nullable: true)]
    private ?string $gpa = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRecord(): SemesterRecord
    {
        return $this->record;
    }

    public function setRecord(SemesterRecord $record): self
    {
        $this->record = $record;
        return $this;
    }

    public function getGpa(): ?string
    {
        return $this->gpa;
    }

    public function setGpa(?string $gpa): self
    {
        $this->gpa = $gpa;
        return $this;
    }
}
