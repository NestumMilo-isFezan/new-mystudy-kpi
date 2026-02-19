import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
	getAvailableStudentsFn,
	getLecturerMentorshipByIdFn,
	getLecturerMentorshipsFn,
} from "./mentorships.functions";

export const lecturerMentorshipsQueryOptions = queryOptions({
	queryKey: ["lecturer-mentorships"],
	queryFn: () => getLecturerMentorshipsFn(),
});

export const mentorshipByIdQueryOptions = (id: number) =>
	queryOptions({
		queryKey: ["mentorship", id],
		queryFn: () => getLecturerMentorshipByIdFn({ data: id }),
		enabled: id > 0,
	});

export const availableStudentsQueryOptions = (batchId: number) =>
	queryOptions({
		queryKey: ["available-students", batchId],
		queryFn: () => getAvailableStudentsFn({ data: batchId }),
		enabled: batchId > 0,
	});

export function useMentorshipById(mentorshipId: number) {
	const { data: mentorship } = useSuspenseQuery(
		mentorshipByIdQueryOptions(mentorshipId),
	);
	return mentorship;
}
