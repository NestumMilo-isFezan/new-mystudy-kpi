import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/http-client";
import type {
	LecturerCreateInput,
	LecturerUpdateInput,
} from "@/lib/api/lecturers.functions";
import {
	createLecturerFn as createLecturer,
	deleteLecturerFn as deleteLecturer,
	updateLecturerFn as updateLecturer,
} from "@/lib/api/lecturers.functions";

export function useLecturerMutations() {
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: (data: LecturerCreateInput) => createLecturer({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lecturers"] });
			toast.success("Lecturer account created successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to create lecturer account");
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: LecturerUpdateInput) => updateLecturer({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lecturers"] });
			toast.success("Lecturer account updated successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to update lecturer account");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteLecturer({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lecturers"] });
			toast.success("Lecturer account deleted");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to delete lecturer account");
		},
	});

	return {
		createMutation,
		updateMutation,
		deleteMutation,
	};
}
