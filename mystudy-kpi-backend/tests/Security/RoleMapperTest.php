<?php

namespace App\Tests\Security;

use App\Entity\User;
use App\Security\RoleMapper;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;

#[CoversClass(RoleMapper::class)]
final class RoleMapperTest extends TestCase
{
    public function testMapsStudentRole(): void
    {
        $mapper = new RoleMapper();

        self::assertSame(User::ROLE_STUDENT, $mapper->toSymfonyRole(User::ROLE_STUDENT_VALUE));
    }

    public function testMapsLecturerRole(): void
    {
        $mapper = new RoleMapper();

        self::assertSame(User::ROLE_LECTURER, $mapper->toSymfonyRole(User::ROLE_LECTURER_VALUE));
    }

    public function testMapsStaffRole(): void
    {
        $mapper = new RoleMapper();

        self::assertSame(User::ROLE_STAFF, $mapper->toSymfonyRole(User::ROLE_STAFF_VALUE));
    }

    public function testRejectsUnknownRoleValue(): void
    {
        $mapper = new RoleMapper();

        $this->expectException(\InvalidArgumentException::class);
        $mapper->toSymfonyRole(99);
    }
}
