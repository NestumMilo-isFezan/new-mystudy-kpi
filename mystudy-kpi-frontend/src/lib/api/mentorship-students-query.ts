import { queryOptions } from "@tanstack/react-query";
import type { AcademicListParams } from "./academic-list-params";
import type { ChallengeListParams } from "./challenge-list-params";
import type { KpiRecordListParams } from "./kpi-record-list-params";
import {
	getMentorshipStudentAcademicsFn,
    getMentorshipStudentAcademicsSortedFn,
	getMentorshipStudentChallengesFn,
	getMentorshipStudentChallengesPageFn,
	getMentorshipStudentKpiRecordsFn,
	getMentorshipStudentKpiRecordsPageFn,
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

export const mentorshipStudentAcademicsSortedQueryOptions = (
	id: string,
	params: AcademicListParams,
) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "academics", "sorted", params] as const,
		queryFn: () => getMentorshipStudentAcademicsSortedFn({ data: { id, ...params } }),
		staleTime: 30_000,
	});

export const mentorshipStudentKpiRecordsQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "kpi-records"] as const,
		queryFn: () => getMentorshipStudentKpiRecordsFn({ data: id }),
	});

export const mentorshipStudentKpiRecordsPageQueryOptions = (
	id: string,
	params: KpiRecordListParams,
) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "kpi-records", "page", params] as const,
		queryFn: () => getMentorshipStudentKpiRecordsPageFn({ data: { id, ...params } }),
		staleTime: 30_000,
	});

export const mentorshipStudentChallengesQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "challenges"] as const,
		queryFn: () => getMentorshipStudentChallengesFn({ data: id }),
	});

export const mentorshipStudentChallengesPageQueryOptions = (
	id: string,
	params: ChallengeListParams,
) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "challenges", "page", params] as const,
		queryFn: () => getMentorshipStudentChallengesPageFn({ data: { id, ...params } }),
		staleTime: 30_000,
	});

export const mentorshipStudentKpiTargetQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["mentorship-students", id, "kpi-target"] as const,
		queryFn: () => getMentorshipStudentKpiTargetFn({ data: id }),
	});
