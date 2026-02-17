<?php

declare(strict_types=1);

namespace App\Tests\Security;

use App\Enum\UserRole;
use App\Security\RoleMapper;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;

#[CoversClass(RoleMapper::class)]
final class RoleMapperTest extends TestCase
{
    public function testMapsStudentRole(): void
    {
        $mapper = new RoleMapper();

        self::assertSame(UserRole::STUDENT->label(), $mapper->toSymfonyRole(UserRole::STUDENT->value));
    }

    public function testMapsLecturerRole(): void
    {
        $mapper = new RoleMapper();

        self::assertSame(UserRole::LECTURER->label(), $mapper->toSymfonyRole(UserRole::LECTURER->value));
    }

    public function testMapsStaffRole(): void
    {
        $mapper = new RoleMapper();

        self::assertSame(UserRole::STAFF->label(), $mapper->toSymfonyRole(UserRole::STAFF->value));
    }

    public function testRejectsUnknownRoleValue(): void
    {
        $mapper = new RoleMapper();

        $this->expectException(\InvalidArgumentException::class);
        $mapper->toSymfonyRole(99);
    }
}
