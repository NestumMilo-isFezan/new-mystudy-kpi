import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

import {
	type LoginPayload,
	login,
	logout,
	type RegisterPayload,
	register,
} from "@/lib/api/auth-api";
import { type SaveProfilePayload, saveProfile } from "@/lib/api/profile-api";
import { getServerSession } from "./get-server-session";

export type Session = Awaited<ReturnType<typeof getServerSession>>;

export const sessionQueryKey = ["auth", "session"] as const;

async function getSession(): Promise<Session | null> {
	return await getServerSession();
}

export const sessionQueryOptions = queryOptions({
	queryKey: sessionQueryKey,
	queryFn: getSession,
	staleTime: 60_000,
});

export function useSessionQuery() {
	return useQuery(sessionQueryOptions);
}

export function useLoginMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: LoginPayload) => login(payload),
		onSuccess: async (data) => {
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
		mutationFn: (payload: RegisterPayload) => register(payload),
	});
}

export function useLogoutMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.setQueryData(sessionQueryKey, null);
		},
	});
}

export function useSaveProfileMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: SaveProfilePayload) => saveProfile(payload),
		onSuccess: (data) => {
			queryClient.setQueryData(sessionQueryKey, {
				user: data.user,
				profile: data.profile,
			});
		},
	});
}
