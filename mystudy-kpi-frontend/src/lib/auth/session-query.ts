import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";

import {
	type LoginPayload,
	loginFn,
	logoutFn,
	type RegisterPayload,
	registerFn,
} from "@/lib/api/auth.functions";
import {
	getProfileFn,
	type SaveProfilePayload,
	type SessionResponse,
	saveProfileFn,
} from "@/lib/api/profile.functions";
import {
	getSessionsFn,
	revokeOtherSessionsFn,
	revokeSessionFn,
} from "@/lib/api/session.functions";

export type Session = SessionResponse;

export const sessionQueryKey = ["auth", "session"] as const;
export const userSessionsQueryKey = ["auth", "user-sessions"] as const;

export { getSessionsFn, revokeSessionFn, revokeOtherSessionsFn };

export const userSessionsQueryOptions = queryOptions({
	queryKey: userSessionsQueryKey,
	queryFn: () => getSessionsFn(),
	staleTime: 60_000,
});

export const sessionQueryOptions = queryOptions({
	queryKey: sessionQueryKey,
	queryFn: () => getProfileFn(),
	staleTime: 60_000,
});

export function useSessionQuery() {
	return useQuery(sessionQueryOptions);
}

export function useUserSessionsQuery() {
	return useQuery(userSessionsQueryOptions);
}

export function useUserSessionsSuspenseQuery() {
	return useSuspenseQuery(userSessionsQueryOptions);
}

export function useRevokeSessionMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => revokeSessionFn({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userSessionsQueryKey });
		},
	});
}

export function useRevokeOtherSessionsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => revokeOtherSessionsFn(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userSessionsQueryKey });
		},
	});
}

export function useLoginMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: LoginPayload) => loginFn({ data: payload }),
		onSuccess: async (data) => {
			queryClient.clear();
			queryClient.setQueryData(sessionQueryKey, {
				user: data.user,
				profile: null,
			});
			await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
		},
	});
}

export function useRegisterMutation() {
	return useMutation({
		mutationFn: (payload: RegisterPayload) => registerFn({ data: payload }),
	});
}

export function useLogoutMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => logoutFn(),
		onSuccess: () => {
			queryClient.setQueryData(sessionQueryKey, null);
		},
	});
}

export function useSaveProfileMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: SaveProfilePayload) =>
			saveProfileFn({ data: payload }),
		onSuccess: (data) => {
			queryClient.setQueryData(sessionQueryKey, {
				user: data.user,
				profile: data.profile,
			});
		},
	});
}
