import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type AccountUpdatePayload,
	deleteAccountFn,
	type PasswordUpdatePayload,
	updateAccountFn,
	updatePasswordFn,
} from "@/lib/api/account.functions";
import { type Session, sessionQueryKey } from "./session-query";

export function useUpdateAccountMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: AccountUpdatePayload) =>
			updateAccountFn({ data: payload }),
		onSuccess: (data) => {
			queryClient.setQueryData<Session>(sessionQueryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					user: data.user,
				};
			});
		},
	});
}

export function useUpdatePasswordMutation() {
	return useMutation({
		mutationFn: (payload: PasswordUpdatePayload) =>
			updatePasswordFn({ data: payload }),
	});
}

export function useDeleteAccountMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteAccountFn(),
		onSuccess: () => {
			queryClient.setQueryData(sessionQueryKey, null);
		},
	});
}
