import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createChallengeFn,
	deleteChallengeFn,
	type SaveChallengePayload,
	updateChallengeFn,
} from "@/lib/api/challenges.functions";
import type { ApiError } from "@/lib/api/http-client";

export function useChallengeMutations() {
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: (payload: SaveChallengePayload) =>
			createChallengeFn({ data: payload }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["challenges"] });
			toast.success("Challenge record created successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to create record");
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: number;
			payload: SaveChallengePayload;
		}) => updateChallengeFn({ data: { id, payload } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["challenges"] });
			toast.success("Challenge record updated successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to update record");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteChallengeFn({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["challenges"] });
			toast.success("Challenge record deleted");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to delete record");
		},
	});

	return {
		createMutation,
		updateMutation,
		deleteMutation,
	};
}
