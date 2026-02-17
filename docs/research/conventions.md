# Project Conventions

## Frontend (TanStack Start + React)
- **Filenames**: Use **kebab-case** for `.ts`/`.tsx` files.
    - *Example*: `route-guards.ts`, `get-server-session.ts`, `auth-layout.tsx`.
- **Routes**: Use TanStack file-based routing in `src/routes`.
    - Use pathless groups (`_public`, `_auth`, `_student`, `_lecturer`, `_staff`) for layout/role boundaries.
- **Imports**: Prefer `@/` alias imports for modules under `src/`.
- **State**: Use **TanStack Query** for server state/session; avoid ad-hoc global stores for auth state.
- **Styling**: Tailwind utility classes with shared UI primitives in `src/components/ui`.

## Backend (Symfony 8)
- **Filenames**: Standard PSR-4 (PascalCase for classes).
- **Entities**: PascalCase, singular.
- **API Paths**: kebab-case (e.g., `/api/intake-batches`).
- **Roles**: Mapped as integers in DB (0=Student, 1=Lecturer, 2=Staff).
- **Boundary Rule**: Keep controllers thin; put business logic in services and domain exceptions.

## Database
- **Naming**: `snake_case` for tables and columns.
- **Primary Keys**: UUID for main entities, INT for lookup tables (like `intake_batches`).
