# Authentication & Authorization Plan

## 1. Background
The legacy system used a simple PHP session-based authentication with a single user type. The refactored system requires a robust, role-based access control (RBAC) system to support Students, Lecturers, and Faculty Staff with distinct permissions and ownership logic.

## 2. Research & Requirements
- **Tech Stack**: Symfony 8 (Backend), TanStack Start + React (Frontend).
- **Protocol**: JWT (JSON Web Token) via HttpOnly Cookies.
- **Roles Mapping**:
    - `0` (STUDENT): Self-registration, manages own KPIs.
    - `1` (LECTURER): Created by Staff, manages assigned mentorees.
    - `2` (STAFF): Created by existing Staff, full system control.
- **Persistence**: PostgreSQL for user credentials and role mapping.

## 3. Execution Plan

### Phase 1: Backend Infrastructure (Symfony)
1. **Entity Creation**:
    - `User`: UUID, identifier (Matric/Staff ID), email, password, and `role` (int).
    - `IntakeBatch`: ID, name, active status.
2. **Security Configuration**:
    - Install `lexik/jwt-authentication-bundle`.
    - Configure custom `UserValueResolver` to map integer `role` to Symfony's `ROLE_*` strings.
    - Implement `Set-Cookie` logic for JWT issuance.
3. **API Endpoints**:
    - `POST /api/register` (Public, Student only).
    - `POST /api/login` (Public, returns HttpOnly Cookie).
    - `GET /api/intake-batches` (Public, for registration dropdown).
    - `POST /api/admin/users` (Staff only, for creating Lecturers).

### Phase 2: Frontend Implementation (TanStack Start)
1. **Routing & Guards**:
    - Use file-based routes in `src/routes` with pathless route groups (`_public`, `_auth`).
    - Enforce access via route `beforeLoad` guards (`requireAuth`, `requireRole`).
2. **Session State**:
    - Fetch session from backend and store in TanStack Query cache.
    - Keep auth state server-driven (cookie + `/api/session`) instead of client-only stores.
3. **Pages & Flows**:
    - Public pages: `/login`, `/register`.
    - Authenticated dashboard pages grouped under `_auth` and role-specific route groups.

### Phase 3: Mentorship Linkage
1. Implement the `Mentorship` and `MentorshipStudent` entities.
2. Create Staff-only UI to assign Lecturers to Batches and Students to Mentorships.

## 4. Testing Strategy
- **Unit Tests**: Test the `RoleMapper` service to ensure `0, 1, 2` correctly translate to `ROLE_STUDENT, ROLE_LECTURER, ROLE_STAFF`.
- **Integration Tests**:
    - Verify that a Student cannot access Lecturer endpoints.
    - Verify that a Lecturer can only access their assigned mentorees' data.
- **Manual Verification**:
    - Attempt self-registration as a Student.
    - Attempt to create a Lecturer account using a Staff account.
    - Verify HttpOnly cookie presence in browser dev tools.
