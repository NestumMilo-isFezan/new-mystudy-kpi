import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/http-client";
import {
	createIntakeBatchFn as createIntakeBatch,
	deleteIntakeBatchFn as deleteIntakeBatch,
	toggleIntakeBatchStatusFn as toggleStatusIntakeBatch,
	updateIntakeBatchFn as updateIntakeBatch,
} from "@/lib/api/intake-batches.functions";

export function useIntakeMutations() {
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: (year: number) => createIntakeBatch({ data: year }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "intake-batches"] });
			toast.success("Intake batch created successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to create intake batch");
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, year }: { id: number; year: number }) =>
			updateIntakeBatch({ data: { id, startYear: year } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "intake-batches"] });
			toast.success("Intake batch updated successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to update intake batch");
		},
	});

	const toggleStatusMutation = useMutation({
		mutationFn: (id: number) => toggleStatusIntakeBatch({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "intake-batches"] });
			toast.success("Intake batch status updated");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to update status");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteIntakeBatch({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "intake-batches"] });
			toast.success("Intake batch deleted");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to delete batch");
		},
	});

	return {
		createMutation,
		updateMutation,
		toggleStatusMutation,
		deleteMutation,
	};
}
