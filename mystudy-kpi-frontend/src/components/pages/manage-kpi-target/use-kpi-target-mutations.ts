import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/http-client";
import {
	type SaveKpiAimPayload,
	updateKpiAimFn,
} from "@/lib/api/kpi-aim.functions";

export function useKpiTargetMutations() {
	const queryClient = useQueryClient();

	const updateMutation = useMutation({
		mutationFn: (payload: SaveKpiAimPayload) =>
			updateKpiAimFn({ data: payload }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["kpi-aim"] });
			toast.success("KPI target updated successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to update KPI target");
		},
	});

	return { updateMutation };
}
