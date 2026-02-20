import { queryOptions } from "@tanstack/react-query";
import {
	getMentorshipStudentAcademicsFn,
	getMentorshipStudentChallengesFn,
	getMentorshipStudentKpiRecordsFn,
	getMentorshipStudentKpiTargetFn,
	getMentorshipStudentOverviewFn,
} from "./mentorships.functions";

export const mentorshipStudentOverviewQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "overview"] as const,
		queryFn: () => getMentorshipStudentOverviewFn({ data: id }),
	});

export const mentorshipStudentAcademicsQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "academics"] as const,
		queryFn: () => getMentorshipStudentAcademicsFn({ data: id }),
	});

export const mentorshipStudentKpiRecordsQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "kpi-records"] as const,
		queryFn: () => getMentorshipStudentKpiRecordsFn({ data: id }),
	});

export const mentorshipStudentChallengesQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "challenges"] as const,
		queryFn: () => getMentorshipStudentChallengesFn({ data: id }),
	});

export const mentorshipStudentKpiTargetQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "kpi-target"] as const,
		queryFn: () => getMentorshipStudentKpiTargetFn({ data: id }),
	});
