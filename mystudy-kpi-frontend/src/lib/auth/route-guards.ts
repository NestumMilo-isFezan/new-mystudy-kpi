import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";

import { type AppRole, mapRole } from "./role-map";
import {
	type Session,
	sessionQueryKey,
	sessionQueryOptions,
} from "./session-query";

async function resolveSession(
	queryClient: QueryClient,
): Promise<Session | null> {
	const cachedSession = queryClient.getQueryData<Session | null>(
		sessionQueryKey,
	);

	if (cachedSession !== undefined) {
		return cachedSession;
	}

	return await queryClient.fetchQuery(sessionQueryOptions);
}

export async function requireAuth(queryClient: QueryClient) {
	const session = await resolveSession(queryClient);

	if (!session) {
		throw redirect({ to: "/login" });
	}

	return session;
}

export async function requireRole(
	queryClient: QueryClient,
	roles: AppRole | AppRole[],
) {
	const session = await requireAuth(queryClient);
	const userRole = mapRole(session.user.role);
	const allowedRoles = Array.isArray(roles) ? roles : [roles];

	if (!userRole) {
		throw redirect({ to: "/login" });
	}

	if (!allowedRoles.includes(userRole)) {
		throw redirect({ to: "/dashboard" });
	}

	return session;
}

export async function requireGuest(queryClient: QueryClient) {
	let session: Session | null = null;

	try {
		session = await resolveSession(queryClient);
	} catch {
		return;
	}

	if (session) {
		throw redirect({ to: "/dashboard" });
	}
}
