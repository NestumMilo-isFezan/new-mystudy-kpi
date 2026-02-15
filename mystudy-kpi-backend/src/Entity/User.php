<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'app_user')]
#[ORM\UniqueConstraint(name: 'uniq_user_identifier', columns: ['identifier'])]
#[ORM\UniqueConstraint(name: 'uniq_user_email', columns: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public const int ROLE_STUDENT_VALUE = 0;
    public const int ROLE_LECTURER_VALUE = 1;
    public const int ROLE_STAFF_VALUE = 2;

    public const string ROLE_STUDENT = 'ROLE_STUDENT';
    public const string ROLE_LECTURER = 'ROLE_LECTURER';
    public const string ROLE_STAFF = 'ROLE_STAFF';

    #[ORM\Id]
    #[ORM\Column(type: 'string', length: 36)]
    private string $id;

    #[ORM\Column(type: 'string', length: 64)]
    private string $identifier;

    #[ORM\Column(type: 'string', length: 180)]
    private string $email;

    #[ORM\Column(type: 'string')]
    private string $password;

    #[ORM\Column(type: 'smallint')]
    private int $role = self::ROLE_STUDENT_VALUE;

    #[ORM\ManyToOne(targetEntity: IntakeBatch::class, inversedBy: 'students')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?IntakeBatch $intakeBatch = null;

    #[ORM\OneToOne(mappedBy: 'user', targetEntity: Profile::class)]
    private ?Profile $profile = null;

    public function __construct()
    {
        $this->id = Uuid::v7()->toRfc4122();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getIdentifier(): string
    {
        return $this->identifier;
    }

    public function setIdentifier(string $identifier): self
    {
        $this->identifier = strtoupper(trim($identifier));

        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = strtolower(trim($email));

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return $this->identifier;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getRoleValue(): int
    {
        return $this->role;
    }

    public function setRoleValue(int $role): self
    {
        if (!\in_array($role, [self::ROLE_STUDENT_VALUE, self::ROLE_LECTURER_VALUE, self::ROLE_STAFF_VALUE], true)) {
            throw new \InvalidArgumentException('Invalid role value provided.');
        }

        $this->role = $role;

        return $this;
    }

    public function getRoles(): array
    {
        return [self::roleValueToRoleName($this->role)];
    }

    public function eraseCredentials(): void
    {
    }

    public function getIntakeBatch(): ?IntakeBatch
    {
        return $this->intakeBatch;
    }

    public function setIntakeBatch(?IntakeBatch $intakeBatch): self
    {
        $this->intakeBatch = $intakeBatch;

        return $this;
    }

    public function getProfile(): ?Profile
    {
        return $this->profile;
    }

    public function setProfile(?Profile $profile): self
    {
        $this->profile = $profile;

        return $this;
    }

    public static function roleValueToRoleName(int $roleValue): string
    {
        return match ($roleValue) {
            self::ROLE_STUDENT_VALUE => self::ROLE_STUDENT,
            self::ROLE_LECTURER_VALUE => self::ROLE_LECTURER,
            self::ROLE_STAFF_VALUE => self::ROLE_STAFF,
            default => self::ROLE_STUDENT,
        };
    }
}
