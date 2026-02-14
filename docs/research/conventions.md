# Project Conventions

## Frontend (Astro + Alpine.js)
- **Filenames**: Use **kebab-case** for all files (`.astro`, `.ts`, `.js`).
    - *Example*: `base-layout.astro`, `login-form.astro`, `auth-middleware.ts`.
- **Component Naming**: Typically use kebab-case in filenames, but they can be imported as PascalCase in Astro files if preferred for clarity.
- **Styling**: Prefer semantic HTML with **OAT UI** styles.
- **State**: Use **Alpine.store** for global state and `x-data` for local component state.

## Backend (Symfony 8)
- **Filenames**: Standard PSR-4 (PascalCase for classes).
- **Entities**: PascalCase, singular.
- **API Paths**: kebab-case (e.g., `/api/intake-batches`).
- **Roles**: Mapped as integers in DB (0=Student, 1=Lecturer, 2=Staff).

## Database
- **Naming**: `snake_case` for tables and columns.
- **Primary Keys**: UUID for main entities, INT for lookup tables (like `intake_batches`).
