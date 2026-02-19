import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/http-client";
import {
	createKpiRecordFn,
	deleteKpiRecordFn,
	type SaveKpiRecordPayload,
	updateKpiRecordFn,
} from "@/lib/api/kpi-records.functions";

export function useKpiRecordMutations() {
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: (payload: SaveKpiRecordPayload) =>
			createKpiRecordFn({ data: payload }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["kpi-records"] });
			toast.success("KPI record created successfully");
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
			payload: SaveKpiRecordPayload;
		}) => updateKpiRecordFn({ data: { id, payload } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["kpi-records"] });
			toast.success("KPI record updated successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to update record");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteKpiRecordFn({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["kpi-records"] });
			toast.success("KPI record deleted");
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
