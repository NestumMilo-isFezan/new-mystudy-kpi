<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ChallengeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChallengeRepository::class)]
#[ORM\Table(name: 'challenge')]
class Challenge
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'smallint')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: SemesterRecord::class)]
    #[ORM\JoinColumn(name: 'record_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private SemesterRecord $record;

    #[ORM\Column(type: 'text')]
    private string $challenge;

    #[ORM\Column(type: 'text')]
    private string $plan;

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

    public function getChallenge(): string
    {
        return $this->challenge;
    }

    public function setChallenge(string $challenge): self
    {
        $this->challenge = $challenge;
        return $this;
    }

    public function getPlan(): string
    {
        return $this->plan;
    }

    public function setPlan(string $plan): self
    {
        $this->plan = $plan;
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
