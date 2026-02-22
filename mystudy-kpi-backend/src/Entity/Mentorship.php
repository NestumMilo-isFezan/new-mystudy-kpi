<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\MentorshipRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MentorshipRepository::class)]
#[ORM\Table(name: 'mentorship')]
#[ORM\UniqueConstraint(name: 'uniq_mentorship_lecturer_batch', columns: ['lecturer_id', 'intake_batch_id'])]
class Mentorship
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'bigint')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'lecturer_id', referencedColumnName: 'id', nullable: false)]
    private User $lecturer;

    #[ORM\ManyToOne(targetEntity: IntakeBatch::class)]
    #[ORM\JoinColumn(name: 'intake_batch_id', referencedColumnName: 'id', nullable: false)]
    private IntakeBatch $intakeBatch;

    /**
     * @var Collection<int, Mentee>
     */
    #[ORM\OneToMany(mappedBy: 'mentorship', targetEntity: Mentee::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $mentees;

    public function __construct()
    {
        $this->mentees = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLecturer(): User
    {
        return $this->lecturer;
    }

    public function setLecturer(User $lecturer): self
    {
        $this->lecturer = $lecturer;

        return $this;
    }

    public function getIntakeBatch(): IntakeBatch
    {
        return $this->intakeBatch;
    }

    public function setIntakeBatch(IntakeBatch $intakeBatch): self
    {
        $this->intakeBatch = $intakeBatch;

        return $this;
    }

    /**
     * @return Collection<int, Mentee>
     */
    public function getMentees(): Collection
    {
        return $this->mentees;
    }

    public function addMentee(Mentee $mentee): self
    {
        if (!$this->mentees->contains($mentee)) {
            $this->mentees->add($mentee);
            $mentee->setMentorship($this);
        }

        return $this;
    }

    public function removeMentee(Mentee $mentee): self
    {
        if ($this->mentees->removeElement($mentee)) {
            // set the owning side to null (unless already changed)
            if ($mentee->getMentorship() === $this) {
                $mentee->setMentorship(null);
            }
        }

        return $this;
    }
}
