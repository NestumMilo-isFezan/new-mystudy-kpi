import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
	getAdminMentorshipByIdFn,
	getAdminMentorshipsFn,
	getAvailableStudentsAdminFn,
	getAvailableStudentsFn,
	getLecturerMentorshipByIdFn,
	getLecturerMentorshipsFn,
} from "./mentorships.functions";

export const lecturerMentorshipsQueryOptions = queryOptions({
	queryKey: ["lecturer-mentorships"] as const,
	queryFn: () => getLecturerMentorshipsFn(),
});

export const adminMentorshipsQueryOptions = queryOptions({
	queryKey: ["admin-mentorships"] as const,
	queryFn: () => getAdminMentorshipsFn(),
});

export const mentorshipByIdQueryOptions = (id: number) =>
	queryOptions({
		queryKey: ["mentorship", id] as const,
		queryFn: () => getLecturerMentorshipByIdFn({ data: id }),
		enabled: id > 0,
	});

export const adminMentorshipByIdQueryOptions = (id: number) =>
	queryOptions({
		queryKey: ["admin-mentorship", id] as const,
		queryFn: () => getAdminMentorshipByIdFn({ data: id }),
		enabled: id > 0,
	});

export const availableStudentsQueryOptions = (batchId: number) =>
	queryOptions({
		queryKey: ["available-students", batchId] as const,
		queryFn: () => getAvailableStudentsFn({ data: batchId }),
		enabled: batchId > 0,
	});

export const availableStudentsAdminQueryOptions = (batchId: number) =>
	queryOptions({
		queryKey: ["admin-available-students", batchId] as const,
		queryFn: () => getAvailableStudentsAdminFn({ data: batchId }),
		enabled: batchId > 0,
	});

export function useMentorshipById(mentorshipId: number) {
	const { data: mentorship } = useSuspenseQuery(
		mentorshipByIdQueryOptions(mentorshipId),
	);
	return mentorship;
}
