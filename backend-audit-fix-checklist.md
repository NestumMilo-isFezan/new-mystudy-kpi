# Backend Audit Fix Checklist

## 1. Type Safety & Standards
- [x] **Enforce Strict Typing**
    - Add `declare(strict_types=1);` to all PHP files in `src/`.
- [x] **Modernize Roles**
    - Convert `User` roles from constants to a PHP 8.1+ Enum (e.g., `App\Enum\UserRole`).
    - Update `User` entity and database mapping to use the Enum.

## 2. Architecture & SOLID Principles
- [x] **Refactor AuthController**
    - Extract registration logic to an `AuthService`.
    - Use Symfony `Validator` and DTOs for input validation.
    - Replace manual array mapping with Symfony `Serializer`.
- [x] **Refactor ProfileController**
    - Extract profile management to a `ProfileService`.
    - Replace manual validation logic (`applyProfileUpdate`) with Symfony Constraints.
- [x] **Standardize Responses**
    - Use a consistent API response format and automate serialization.

## 3. Security
- [x] **Centralize Cookie Management**
    - Extract `AUTH_TOKEN` cookie configuration (Secure, HttpOnly, SameSite) to a dedicated service or listener to prevent duplication and ensure consistency.

## 4. Code Quality
- [x] **Constructor Property Promotion**
    - Update Services and Repositories to use PHP 8 constructor property promotion for dependency injection.
- [x] **Custom Exceptions**
    - Implement specific domain exceptions (e.g., `InvalidCredentialsException`) instead of returning `JsonResponse` directly from deep logic.
