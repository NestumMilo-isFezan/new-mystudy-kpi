import { useAuth } from "@/lib/auth/auth-context";
import { type AppRole, mapRole } from "@/lib/auth/role-map";

export function useRole(): AppRole | null {
	const { session } = useAuth();

	if (!session) {
		return null;
	}

	return mapRole(session.user.role);
}

export function useIsRole(roles: AppRole | AppRole[]): boolean {
	const role = useRole();

	if (!role) {
		return false;
	}

	const allowedRoles = Array.isArray(roles) ? roles : [roles];
	return allowedRoles.includes(role);
}
