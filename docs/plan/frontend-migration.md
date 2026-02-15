# Frontend Migration Plan (Astro -> TanStack Start)

## 1. Objective
Track migration of the frontend from Astro to TanStack Start while preserving working backend auth/profile APIs and minimizing regressions.

## 2. Current Status Snapshot

### Backend (already implemented)
- JWT auth via HttpOnly cookie (`AUTH_TOKEN`) and role-based access control.
- Endpoints available:
  - `POST /api/register`
  - `POST /api/login`
  - `POST /api/logout`
  - `GET /api/intake-batches`
  - `POST /api/admin/users` (staff-only)
  - `GET /api/profile`
  - `PUT /api/profile`
- Staff seeder command exists: `app:user:create-staff`.
- PHPUnit suite currently passing.

### Frontend (Astro, in-progress and unstable)
- Public landing page and auth/profile/dashboard routes were scaffolded.
- Auth middleware and Alpine store were attempted.
- Login behavior is currently unreliable in runtime (reported by manual QA).

## 3. Migration Decision
- New frontend target: **TanStack Start**.
- Keep Symfony backend as source of truth for authentication, authorization, and data.
- Use same-origin `/api/*` proxy pattern in dev/prod so HttpOnly cookie auth remains stable.

## 4. Feature Mapping (Track What Was Created)

| Feature | Backend | Astro Status | TanStack Start Target |
|---|---|---|---|
| Public landing page (`/`) | N/A | Exists | Rebuild |
| Login (`/login`) | Ready | Unstable | Rebuild |
| Register (`/register`) | Ready | Partial | Rebuild |
| Protected dashboard (`/dashboard`) | Ready | Partial | Rebuild |
| Protected profile (`/profile`) | Ready | Partial | Rebuild |
| Role guard rendering | Ready | Partial | Rebuild |
| Logout flow | Ready | Partial | Rebuild |

## 5. Migration Scope

### In scope
1. Create TanStack Start app in `mystudy-kpi-frontend`.
2. Implement route-level auth guards for protected routes.
3. Port auth and profile user flows:
   - login, register, logout
   - read/update profile
   - dashboard with role-aware sections
4. Wire frontend-to-backend API client with cookie credentials.
5. Update compose/devcontainer runtime to serve TanStack frontend.
6. Add a minimal smoke test checklist for manual QA.

### Out of scope (for this phase)
- Mentorship assignment UI.
- KPI data management screens.
- Full UI redesign and design system overhaul.

## 6. Execution Plan & Checklist

## Phase 1: Foundation
- [ ] Initialize TanStack Start project structure in `mystudy-kpi-frontend`.
- [ ] Configure TypeScript, route tree, and env handling.
- [ ] Add API client layer (`credentials: 'include'`, typed responses).

## Phase 2: Auth Flows
- [ ] Implement `/login` with backend `POST /api/login`.
- [ ] Implement `/register` with `GET /api/intake-batches` + `POST /api/register`.
- [ ] Implement logout action with `POST /api/logout`.

## Phase 3: Protected App Area
- [ ] Add route guard for `/dashboard` and `/profile`.
- [ ] Implement `/dashboard` with user and role-aware rendering.
- [ ] Implement `/profile` with `GET /api/profile` + partial `PUT /api/profile`.

## Phase 4: Integration & Delivery
- [ ] Configure same-origin `/api` proxy path for local and containerized dev.
- [ ] Verify Caddy routing compatibility.
- [ ] Run frontend build and smoke test full auth journey.
- [ ] Mark Astro implementation deprecated and remove obsolete files.

## 7. Validation Checklist (Manual)
- [ ] Landing page is public.
- [ ] Unauthenticated access to `/dashboard` redirects to `/login`.
- [ ] Staff login succeeds with seeded account.
- [ ] Register student flow works with intake batch selection.
- [ ] Profile save (partial update) persists and reloads correctly.
- [ ] Logout clears access to protected routes.

## 8. Risks and Mitigations
- **Cookie/session mismatch across domains** -> enforce same-origin `/api` through proxy.
- **Divergent frontend/backend contracts** -> maintain typed API client and explicit response parsing.
- **Regression during framework switch** -> migrate route-by-route and validate after each phase.

## 9. Definition of Done
- TanStack Start frontend replaces Astro runtime for auth/profile/dashboard flows.
- All items in Sections 6 and 7 are complete.
- No blocker remains for continuing feature development on the new frontend stack.
