import { useSessionQuery } from "./session-query";

/**
 * Hook to access the current authentication session.
 * Leverages TanStack Query for state management, eliminating the need for a separate store.
 */
export function useAuth() {
	const { data: session, status, isPending, error } = useSessionQuery();

	return {
		session: session ?? null,
		status,
		isPending,
		error: error ?? null,
		isAuthenticated: !!session,
	};
}
