import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/lib/api/http-client";
import {
	assignMenteesFn as assignMentees,
	assignMenteesAdminFn as assignMenteesAdmin,
	deleteMenteeFn as deleteMentee,
	deleteMenteeAdminFn as deleteMenteeAdmin,
	deleteMentorshipFn as deleteMentorship,
	quickCreateStudentFn as quickCreateStudent,
} from "@/lib/api/mentorships.functions";
import type { StudentCreateInput } from "@/lib/api/students.functions";

export function useMentorshipMutations() {
	const queryClient = useQueryClient();

	const assignMutation = useMutation({
		mutationFn: (data: { batchId: number; studentIds: string[] }) =>
			assignMentees({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lecturer-mentorships"] });
			queryClient.invalidateQueries({ queryKey: ["admin-mentorships"] });
			queryClient.invalidateQueries({ queryKey: ["mentorship"] });
			queryClient.invalidateQueries({ queryKey: ["available-students"] });
			toast.success("Mentees assigned successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to assign mentees");
		},
	});

	const assignAdminMutation = useMutation({
		mutationFn: (data: {
			batchId: number;
			studentIds: string[];
			lecturerId: string;
		}) => assignMenteesAdmin({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lecturer-mentorships"] });
			queryClient.invalidateQueries({ queryKey: ["admin-mentorships"] });
			queryClient.invalidateQueries({ queryKey: ["mentorship"] });
			queryClient.invalidateQueries({ queryKey: ["admin-mentorship"] });
			queryClient.invalidateQueries({ queryKey: ["available-students"] });
			toast.success("Mentees assigned successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to assign mentees");
		},
	});

	const removeMenteeMutation = useMutation({
		mutationFn: (id: string) => deleteMentee({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lecturer-mentorships"] });
			queryClient.invalidateQueries({ queryKey: ["admin-mentorships"] });
			queryClient.invalidateQueries({ queryKey: ["available-students"] });
			toast.success("Mentee removed from mentorship");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to remove mentee");
		},
	});

	const removeMenteeAdminMutation = useMutation({
		mutationFn: (id: string) => deleteMenteeAdmin({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lecturer-mentorships"] });
			queryClient.invalidateQueries({ queryKey: ["admin-mentorships"] });
			queryClient.invalidateQueries({ queryKey: ["available-students"] });
			toast.success("Mentee removed from mentorship");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to remove mentee");
		},
	});

	const deleteMentorshipMutation = useMutation({
		mutationFn: (id: number) => deleteMentorship({ data: id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lecturer-mentorships"] });
			queryClient.invalidateQueries({ queryKey: ["admin-mentorships"] });
			queryClient.invalidateQueries({ queryKey: ["mentorship"] });
			queryClient.invalidateQueries({ queryKey: ["admin-mentorship"] });
			toast.success("Mentorship record deleted");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to delete mentorship record");
		},
	});

	const quickCreateStudentMutation = useMutation({
		mutationFn: (data: StudentCreateInput) => quickCreateStudent({ data }),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["available-students", variables.intakeBatchId],
			});
			toast.success("Student account created successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Failed to create student account");
		},
	});

	return {
		assignMutation,
		assignAdminMutation,
		removeMenteeMutation,
		removeMenteeAdminMutation,
		deleteMentorshipMutation,
		quickCreateStudentMutation,
	};
}
