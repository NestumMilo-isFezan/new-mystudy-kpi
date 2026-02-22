<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\MenteeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MenteeRepository::class)]
#[ORM\Table(name: 'mentee')]
#[ORM\UniqueConstraint(name: 'uniq_mentee_student', columns: ['student_id'])]
class Mentee
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'bigint')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Mentorship::class, inversedBy: 'mentees')]
    #[ORM\JoinColumn(name: 'mentorship_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Mentorship $mentorship = null;

    #[ORM\OneToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'student_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private User $student;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $notes = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMentorship(): ?Mentorship
    {
        return $this->mentorship;
    }

    public function setMentorship(?Mentorship $mentorship): self
    {
        $this->mentorship = $mentorship;

        return $this;
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
