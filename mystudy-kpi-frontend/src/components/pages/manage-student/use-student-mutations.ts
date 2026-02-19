import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/http-client";
import type {
	StudentCreateInput,
	StudentUpdateInput,
} from "@/lib/api/students.functions";
import {
	createStudentFn as createStudent,
	deleteStudentFn as deleteStudent,
	updateStudentFn as updateStudent,
} from "@/lib/api/students.functions";

export function useStudentMutations() {
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: (data: StudentCreateInput) => createStudent({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
			toast.success("Student account created successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to create student account");
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: StudentUpdateInput) => updateStudent({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
			toast.success("Student account updated successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to update student account");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteStudent({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
			toast.success("Student account deleted");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to delete student account");
		},
	});

	return {
		createMutation,
		updateMutation,
		deleteMutation,
	};
}
