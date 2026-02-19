# Code Style

## Naming Conventions
- **Frontend Files:** kebab-case (`src/lib/api/auth-api.ts`, `src/lib/auth/route-guards.ts`).
- **Server Functions:** suffix `Fn` (`loginFn`, `updateAccountFn`) and defined in `*.functions.ts` files within `src/lib/api/`.
- **React Hooks:** prefixed with `use` (`src/hooks/use-mobile.ts`).
- **Functions:** lower camelCase.
- **Constants:** UPPER_SNAKE_CASE.
- **PHP Classes:** PascalCase matching filename (`src/Service/ProfileService.php`).
- **PHP Tests:** suffix `*Test` (`tests/Controller/ProfileControllerTest.php`).
- **Legacy PHP:** (Reference only) Mixed camelCase and snake_case.

## File Organization
- **Frontend Routes:** TanStack Router file-based routing in `src/routes/`.
- **Frontend Domain Logic:** Grouped in `src/lib/` (e.g., `api/`, `auth/`). Server functions are located in `src/lib/api/*.functions.ts`.
- **Frontend UI Components:** Shadcn UI primitives in `src/components/ui/`.
- **Frontend Feature Components:** Grouped in `src/components/pages/[feature]/`.
  - `[feature]-header.tsx`: Static page header (title, actions).
  - `[feature]-table.tsx`: Data-dependent table component.
  - `[feature]-table-skeleton.tsx`: Loading state component.
  - `[feature]-card.tsx`: Mobile card view.
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

## Table System Patterns
- **Declarative Config:** Table behavior (query, filters, sorting, column visibility) must be defined in a `TableControlConfig` object. This config specifies:
  - `query`: Desktop and mobile searchable columns.
  - `filters`: Column-specific filter labels and options.
  - `sortOptions`: Available sorting fields.
  - `columns`: Visibility and hideable properties for each column.
- **Multiple Filters:** Use the `filters` array in the config. Filter labels should be displayed as `Label: Value` for clarity.
- **Filter Headers:** Use `FilterCell` in column headers for columns that support both filtering and sorting.
- **Sort Headers:** Use `SortCell` for simple 3-state toggle sorting (None -> Asc -> Desc -> None).
- **Toolbars:** Use modular toolbar components (`InputQuery`, `FilterDropdown`, `ColumnDropdown`) that consume the `useTableContext` hook to maintain consistency.
- **Clear Actions:** Always provide a `destructive` variant "Clear" button that resets all queries, filters, and sorts.

## Code Patterns
- **Frontend Server Functions:**
  - **Naming:** Must end with `Fn`.
  - **Location:** Place in `src/lib/api/[feature].functions.ts`.
  - **Cookie Forwarding:** Must manually extract `AUTH_TOKEN` using `getCookie` and forward it in the `ky` request `Cookie` header when calling the backend.
  - **Environment:** Use `getApiBaseUrl()` helper to resolve the backend target.
- **Frontend Routes:** Use `createFileRoute` with `beforeLoad` for authentication and role-based guards (`requireAuth`, `requireRole`). Use `ensureQueryData` to handle session pre-fetching.
- **Role-Based Routing:** Group pages under pathless layout routes (`_student`, `_lecturer`) to enforce role restrictions at the route level. `requireRole` accepts a single role or an array of `AppRole` values.
- **Component Access:** Use the `useRole` hook for conditional rendering based on user roles within components.
- **Navigation:** Use TanStack Router's `<Link>` component for all internal client-side navigation instead of `<a>` tags.
- **Frontend State:** Server state managed via TanStack Query.
- **Frontend API:** Use `ky` wrapper (`http-client.ts`) with typed request helpers (`getRequest`, `postRequest`).
- **Backend Controllers:** Extend `AbstractController`, return JSON via `$this->json()`. Use Symfony 8.0 attributes like `#[IsGranted]` and `#[Route]`.
- **Backend DTOs:** Used for request payload validation with `#[MapRequestPayload]`.
- **Modern PHP:** Use constructor property promotion and `readonly` properties for services, DTOs, and controllers (PHP 8.4+ features).
- **Frontend Error Pages:** Use `isSessionOutageError` in `errorComponent` to detect when the backend session endpoint is unreachable and provide a specialized "Service unavailable" retry UI.

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
