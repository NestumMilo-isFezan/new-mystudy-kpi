import { queryOptions } from "@tanstack/react-query";
import type { AcademicListParams } from "./academic-list-params";
import type { ChallengeListParams } from "./challenge-list-params";
import type { ListParams } from "./list-params";
import type { KpiRecordListParams } from "./kpi-record-list-params";
import {
	getAdminStudentAcademicsFn,
	getAdminStudentAcademicsSortedFn,
	getAdminStudentChallengesFn,
	getAdminStudentChallengesPageFn,
	getAdminStudentKpiRecordsFn,
	getAdminStudentKpiRecordsPageFn,
	getAdminStudentKpiTargetFn,
	getAdminStudentOverviewFn,
	getStudentsPageFn,
} from "./students.functions";

export const studentsPageQueryOptions = (params: ListParams) =>
	queryOptions({
		queryKey: ["students", "page", params] as const,
		queryFn: () => getStudentsPageFn({ data: params }),
		staleTime: 30_000,
	});

export const adminStudentOverviewQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["admin-students", id, "overview"] as const,
		queryFn: () => getAdminStudentOverviewFn({ data: id }),
	});

export const adminStudentAcademicsQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["admin-students", id, "academics"] as const,
		queryFn: () => getAdminStudentAcademicsFn({ data: id }),
	});

export const adminStudentAcademicsSortedQueryOptions = (
	id: string,
	params: AcademicListParams,
) =>
	queryOptions({
		queryKey: ["admin-students", id, "academics", "sorted", params] as const,
		queryFn: () => getAdminStudentAcademicsSortedFn({ data: { id, ...params } }),
		staleTime: 30_000,
	});

export const adminStudentKpiRecordsQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["admin-students", id, "kpi-records"] as const,
		queryFn: () => getAdminStudentKpiRecordsFn({ data: id }),
	});

export const adminStudentKpiRecordsPageQueryOptions = (
	id: string,
	params: KpiRecordListParams,
) =>
	queryOptions({
		queryKey: ["admin-students", id, "kpi-records", "page", params] as const,
		queryFn: () => getAdminStudentKpiRecordsPageFn({ data: { id, ...params } }),
		staleTime: 30_000,
	});

export const adminStudentChallengesQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["admin-students", id, "challenges"] as const,
		queryFn: () => getAdminStudentChallengesFn({ data: id }),
	});

export const adminStudentChallengesPageQueryOptions = (
	id: string,
	params: ChallengeListParams,
) =>
	queryOptions({
		queryKey: ["admin-students", id, "challenges", "page", params] as const,
		queryFn: () => getAdminStudentChallengesPageFn({ data: { id, ...params } }),
		staleTime: 30_000,
	});

export const adminStudentKpiTargetQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["admin-students", id, "kpi-target"] as const,
		queryFn: () => getAdminStudentKpiTargetFn({ data: id }),
	});
