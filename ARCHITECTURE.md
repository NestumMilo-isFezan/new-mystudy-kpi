# Architecture

## Overview
- Monorepo with a modern TanStack Start frontend, Symfony API backend, and a legacy PHP app kept as a git submodule for reference.
- Primary goal: student KPI management, including authentication, profiles, and academic performance tracking.

## Tech Stack
- **Frontend:** React 19, TanStack Start, Vite, Tailwind CSS, Biome (linting/formatting).
- **Backend:** Symfony 8.0, PHP 8.4+, Doctrine ORM (PostgreSQL), Lexik JWT.
- **Database:** PostgreSQL for the modern stack.
- **Legacy:** PHP 7.x + MySQL (contained in `legacy-mystudy-kpi/`).
- **Infrastructure:** Docker Compose for development and production environments.

## Directory Structure
- `mystudy-kpi-frontend/` - TanStack Start application.
- `mystudy-kpi-backend/` - Symfony API application.
- `legacy-mystudy-kpi/` - Legacy PHP reference (submodule).
- `docs/` - Project documentation, plans, and research.
- `.devcontainer/` - Standardized development environment configuration.

## Core Components

### Frontend (TanStack Start)
- **Routing:** File-based routing with TanStack Router. Uses pathless routes (`_auth`, `_public`) for layout grouping and role-based route groups (`_student`, `_lecturer`, `_staff`) for permission scopes.
- **Server Functions:** Heavy use of `createServerFn` for all data mutations and sensitive data fetching. These functions act as a secure proxy between the browser and the Symfony API.
  - **Cookie Management:** Server functions manually forward the `AUTH_TOKEN` cookie to the Symfony backend and proxy `Set-Cookie` headers back to the browser.
  - **API Proxying:** All external API calls are channeled through these server functions to hide the backend URL and handle authentication securely.
- **Auth & Role Guarding:** Enforced via `beforeLoad` in route definitions using `requireAuth` and `requireRole`. The root and `_auth` routes use `ensureQueryData` to fetch or verify the session from TanStack Query.
- **State Management:** TanStack Query for server state and session management.
- **Universal Table System:** A headless, declarative table architecture built on TanStack Table.
  - **TableControl:** Provides a centralized context for state (sorting, filtering, visibility). It consumes a `TableControlConfig` to define columns, searchable fields, and filters.
  - **TableToolbar:** Modular UI components (`InputQuery`, `FilterDropdown`, `ColumnDropdown`) that sync with the table state via the `useTableContext` hook.
  - **Responsive Design:** Adaptive 2-column grid for mobile controls and integrated header-cell filtering for desktop.
- **Page Structure (Data Features):**
  - **Split View Pattern:** Pages are divided into a **Static Header** (title, primary actions) and a **Suspense-wrapped Body** (table, list).
  - **Stable Layout:** This ensures the UI frame remains stable during data refreshes, avoiding layout shifts or flickering.
  - **Skeletons:** Custom skeleton components match the exact layout of the data view (desktop table vs. mobile cards) for smooth loading transitions.
- **API Client:** `ky` configured with `credentials: 'include'` for cookie-based authentication.
- **Error Handling:** Routes can use an `errorComponent` with logic like `isSessionOutageError` to distinguish between application errors and backend availability issues.
- **UI Components:** Shadcn UI primitives located in `src/components/ui`.

### Backend (Symfony)
- **API Endpoints:** Controllers in `src/Controller/Api/` handle JSON requests/responses.
- **Business Logic:** Services in `src/Service/` encapsulate domain logic and mutations.
- **Data Transfer:** DTOs with Symfony's `MapRequestPayload` attribute for request validation.
- **Authentication:** Stateless JWT-based authentication. Tokens are stored in a secure `AUTH_TOKEN` cookie via `CookieService`.
- **Error Handling:** `ExceptionListener` converts domain and system exceptions into standardized JSON responses.

## Data Flow

### Authentication & Session
1.  **Initial Load:** The root route loader (`__root.tsx`) fetches the session from the server.
2.  **Session Cache:** Session data is stored in the TanStack Query cache.
3.  **Guarded Routes:** `_auth` route group checks for session in `beforeLoad`. If missing, it redirects to `/login`.
4.  **Role Verification:** Role-specific pathless routes (e.g., `_student`) check the user's role in `beforeLoad` using `requireRole`. Unauthorized access redirects to the dashboard.
5.  **Login/Logout:** Handled via mutations that update the query cache and manage the `AUTH_TOKEN` cookie.

### API Requests
1.  **Frontend:** Components use TanStack Query hooks or direct API calls via `ky` wrapper.
2.  **Request:** HTTP requests include the `AUTH_TOKEN` cookie.
3.  **Backend:** Symfony's security firewall extracts the JWT from the cookie and authenticates the user.
4.  **Response:** Controllers return JSON, often using Serializers to transform entities into response objects.

## External Integrations
- **PostgreSQL:** Main database for the modern Symfony stack.
- **LexikJWTBundle:** Used for generating and validating JWTs.

## Configuration
- **Monorepo:** Orchestrated via `compose.yaml` and `.devcontainer`.
- **Frontend:** `vite.config.ts`, `tsconfig.json`, and `biome.json`.
- **Backend:** Symfony configuration in `config/`, including `security.yaml` and `lexik_jwt_authentication.yaml`.
