# Frontend Audit Fix Checklist

## 1. SSR Authentication & RPC
- [x] **Refactor `getServerSession` (`src/lib/auth/get-server-session.ts`)**
    - Replace `fetch` with `ky` for consistency.
    - Ensure it uses `getApiBaseUrl()` to handle server-side absolute URLs.
    - Properly forward the `AUTH_TOKEN` cookie from the request to the backend.
- [x] **Update Session Query (`src/lib/auth/session-query.ts`)**
    - Update `sessionQueryOptions` to use `getServerSession` as the `queryFn`.
    - This fixes the "relative URL" error during SSR and enables TanStack Start's RPC mechanism.

## 2. Code Consistency & Styling
- [x] **Refactor Header Component (`src/components/header.tsx`)**
    - Use the `cn()` utility (`src/lib/utils.ts`) for managing Tailwind classes.
    - Replace static string concatenation with `cn()` for `baseNavClass` and `activeNavClass`.
- [x] **Standardize HTTP Client Usage**
    - Ensure `ky` is used consistently across all integrations to leverage the centralized `ApiError` handling.

## 3. Architecture & State
- [x] **Review `AuthProvider` Sync Logic**
    - Eliminated redundant Zustand store and manual synchronization.
    - Session state is now managed entirely by TanStack Query.
    - Replaced `useAuthStore` with a lean `useAuth` hook.
