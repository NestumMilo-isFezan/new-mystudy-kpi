import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	updateGpaFn as updateGpa,
	saveAcademicFn as upsertAcademic,
} from "@/lib/api/academics.functions";
import type { ApiError } from "@/lib/api/http-client";

export function useAcademicsMutations() {
	const queryClient = useQueryClient();

	const upsertMutation = useMutation({
		mutationFn: (payload: {
			semester: number;
			academicYear: number;
			gpa: string;
		}) => upsertAcademic({ data: payload }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["academics"] });
			toast.success("Semester record saved successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to save record");
		},
	});

	const updateGpaMutation = useMutation({
		mutationFn: (payload: { id: number; gpa: string }) =>
			updateGpa({ data: payload }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["academics"] });
			toast.success("GPA updated successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to update GPA");
		},
	});

	return {
		upsertMutation,
		updateGpaMutation,
	};
}
