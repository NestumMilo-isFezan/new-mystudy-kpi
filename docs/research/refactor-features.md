# Refactor Features & Tech Stack Plan

## 1. New Technology Stack

### Backend: Symfony (PHP 8.2+)
- **API-First**: Building a RESTful API using Symfony API Platform or standard Controllers.
- **ORM**: Doctrine for managing the `mykpi` database with modern entity relationships.
- **Security**: LexikJWTAuthenticationBundle for stateless JWT authentication.
- **Validation**: Symfony Constraints to replace manual PHP checks.

### Frontend: Astro + Alpine.js + OAT UI
- **Framework**: **Astro** for a content-driven, high-performance frontend.
- **Reactivity**: **Alpine.js** for lightweight client-side interactions (tabs, modals, form handling).
- **Styling**: **OAT UI** for a clean, semantic-first UI. OAT UI's approach of styling standard HTML elements fits perfectly with Astro's "Zero JS by default" philosophy.
- **State Management**: Alpine.js `x-data` and `x-store` for local state (e.g., current active KPI tab).

## 2. Feature Refactoring Plan

### A. Authentication & User Management
- **Student Registration**: 
    - Self-service form.
    - **Intake Batch**: Must select from a dynamic list provided by the `intake_batches` table.
- **Lecturer/Staff Account Creation**:
    - **No self-registration**.
    - Created manually by existing **Faculty Staff**.
    - Staff sets the initial password and assigns the `ROLE_LECTURER` or `ROLE_STAFF`.
- **JWT & Cookies**: Secure HttpOnly cookie-based session management.

### B. Mentorship System (New)
- **Mentorship Groups**: Staff creates groups linking a Lecturer to a specific Batch.
- **Lecturer Access**: Lecturers gain access to student KPIs automatically based on `mentorship_students` mapping.

### B. State Management (The "Context" Equivalent)
- **Alpine.store**: Instead of a React Context Provider, we use a global Alpine store to hold "Auth Context" (e.g., user profile, permissions).
- **Implementation**:
  ```javascript
  document.addEventListener('alpine:init', () => {
      Alpine.store('auth', {
          user: null,
          isAuthenticated: false,
          init() {
              // Sync with server-provided state or fetch profile
          }
      })
  })
  ```
- **Usage**: Any OAT UI component or Astro fragment can use `x-data` to bind to `$store.auth.user`.

### C. CRUD Operations (Interactivity)
- **Activity/Competition/Certificate**:
    - Use Alpine.js to handle "Add/Edit" modals without page refreshes.
    - **OAT UI Integration**: Leverage OAT's semantic styling for forms (`<form>`, `<input>`, `<select>`) and tables to maintain a consistent, lightweight look.
- **API Integration**: Symfony endpoints for each resource (e.g., `GET /api/activities`, `POST /api/activities`).

### D. Data Visualization (Optional Enhancement)
- Use a lightweight library like Chart.js (via Alpine.js) to visualize CGPA trends, replacing the static table-only view of the legacy system.

## 3. Key Improvements
- **Performance**: Astro's partial hydration ensures minimal JS is sent to the client.
- **Developer Experience**: Symfony's CLI and debugging tools vs. legacy procedural code.
- **Consistency**: OAT UI provides a unified design language without the overhead of heavy CSS frameworks.
- **Scalability**: Decoupling the frontend and backend allows for easier future updates (e.g., building a mobile app later using the same Symfony API).
