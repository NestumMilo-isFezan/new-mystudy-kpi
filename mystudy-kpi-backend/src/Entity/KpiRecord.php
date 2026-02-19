<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\KpiRecordRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: KpiRecordRepository::class)]
#[ORM\Table(name: 'kpi_record')]
class KpiRecord
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'smallint')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: SemesterRecord::class, inversedBy: 'kpiRecords')]
    #[ORM\JoinColumn(name: 'record_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private SemesterRecord $record;

    #[ORM\Column(type: 'string', length: 25)]
    private string $type; // 'activity', 'competition', 'certification'

    #[ORM\Column(type: 'string', length: 255)]
    private string $title;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: 'smallint', nullable: true)]
    private ?int $level = null; // Mapping (Activity/Comp): 0=Faculty... 4=International

    #[ORM\Column(type: 'smallint', nullable: true)]
    private ?int $category = null; // Mapping (Cert): 0=Professional, 1=Technical

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $tags = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $notes = null;

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

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getLevel(): ?int
    {
        return $this->level;
    }

    public function setLevel(?int $level): self
    {
        $this->level = $level;
        return $this;
    }

    public function getCategory(): ?int
    {
        return $this->category;
    }

    public function setCategory(?int $category): self
    {
        $this->category = $category;
        return $this;
    }

    public function getTags(): ?array
    {
        return $this->tags;
    }

    public function setTags(?array $tags): self
    {
        $this->tags = $tags;
        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): self
    {
        $this->notes = $notes;
        return $this;
    }
}
