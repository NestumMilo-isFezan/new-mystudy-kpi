# Code Style

## Naming Conventions
- **Frontend Files:** kebab-case (`src/lib/api/auth-api.ts`, `src/lib/auth/route-guards.ts`).
- **React Hooks:** prefixed with `use` (`src/hooks/use-mobile.ts`).
- **Functions:** lower camelCase.
- **Constants:** UPPER_SNAKE_CASE.
- **PHP Classes:** PascalCase matching filename (`src/Service/ProfileService.php`).
- **PHP Tests:** suffix `*Test` (`tests/Controller/ProfileControllerTest.php`).
- **Legacy PHP:** (Reference only) Mixed camelCase and snake_case.

## File Organization
- **Frontend Routes:** TanStack Router file-based routing in `src/routes/`.
- **Frontend Domain Logic:** Grouped in `src/lib/` (e.g., `api/`, `auth/`).
- **Frontend UI Components:** Shadcn UI primitives in `src/components/ui/`.
- **Backend API:** Controllers in `src/Controller/Api/`.
- **Backend Logic:** Services in `src/Service/`.
- **Backend Data Transfer:** DTOs in `src/Dto/`.
- **Backend Persistence:** Entities in `src/Entity/` and Repositories in `src/Repository/`.

## Formatting & Linting
- **Frontend:** Biome is used for linting and formatting.
  - **Indentation:** Tabs.
  - **Quotes:** Double quotes for strings.
  - **Imports:** Organized and grouped (handled by Biome).
- **Backend:** PSR-12/PER standards.
  - **Indentation:** 4 spaces.
  - **Strict Types:** `declare(strict_types=1);` required at the top of every PHP file.

## Import Style
- **Frontend:** Use path alias `@/` for `src/` directory.
- **Backend:** Explicit `use` statements at the top of the file.

## Code Patterns
- **Frontend Routes:** Use `createFileRoute` with `beforeLoad` for authentication and role-based guards (`requireAuth`, `requireRole`).
- **Role-Based Routing:** Group pages under pathless layout routes (`_student`, `_lecturer`) to enforce role restrictions at the route level.
- **Component Access:** Use the `useRole` hook for conditional rendering based on user roles within components.
- **Navigation:** Use TanStack Router's `<Link>` component for all internal client-side navigation instead of `<a>` tags.
- **Frontend State:** Server state managed via TanStack Query.
- **Frontend API:** Use `ky` wrapper (`http-client.ts`) with typed request helpers (`getRequest`, `postRequest`).
- **Backend Controllers:** Extend `AbstractController`, return JSON via `$this->json()`.
- **Backend DTOs:** Used for request payload validation with `MapRequestPayload`.
- **Modern PHP:** Use constructor property promotion and readonly properties where possible (PHP 8.4+ features).

## Error Handling
- **Frontend:** API errors are instances of `ApiError` containing status and payload.
- **Backend:** Custom domain exceptions (extending `DomainException`) are converted to JSON by a global `ExceptionListener`.
- **Validation:** Use Symfony's `Validator` (often via `MapRequestPayload`) for early request validation.

## Testing
- **Integration Tests:** Symfony `WebTestCase` with `KernelBrowser` for API testing.
- **Unit Tests:** PHPUnit with `#[CoversClass]` attribute for class-level coverage.
- **Mocking:** Standard PHPUnit mocks.

## Do's and Don'ts
- **Do** use `@/` alias for all internal frontend imports.
- **Do** leverage TanStack Query for session and data management.
- **Do** use pathless routes (`_student`, `_staff`) to enforce role-based access control efficiently.
- **Do** keep business logic in Services, keep Controllers thin.
- **Don't** use `<a>` tags for internal links; always use `<Link>`.
- **Don't** edit `src/routeTree.gen.ts` in the frontend; it is auto-generated.
- **Don't** use `$_SESSION` or `die()` in the modern backend stack.
