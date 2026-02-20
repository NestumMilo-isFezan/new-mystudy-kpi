import { queryOptions } from "@tanstack/react-query";
import {
	getAdminStudentAcademicsFn,
	getAdminStudentChallengesFn,
	getAdminStudentKpiRecordsFn,
	getAdminStudentKpiTargetFn,
	getAdminStudentOverviewFn,
	getAllStudentsFn,
} from "./students.functions";

export const allStudentsQueryOptions = queryOptions({
	queryKey: ["students", "all"] as const,
	queryFn: () => getAllStudentsFn(),
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

export const adminStudentKpiRecordsQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["admin-students", id, "kpi-records"] as const,
		queryFn: () => getAdminStudentKpiRecordsFn({ data: id }),
	});

export const adminStudentChallengesQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["admin-students", id, "challenges"] as const,
		queryFn: () => getAdminStudentChallengesFn({ data: id }),
	});

export const adminStudentKpiTargetQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["admin-students", id, "kpi-target"] as const,
		queryFn: () => getAdminStudentKpiTargetFn({ data: id }),
	});
