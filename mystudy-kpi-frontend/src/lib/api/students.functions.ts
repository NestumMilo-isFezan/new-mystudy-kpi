import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";
import type { AcademicRecord } from "./academics.functions";
import { academicListParamsSchema } from "./academic-list-params";
import { challengeListParamsSchema } from "./challenge-list-params";
import type { Challenge } from "./challenges.functions";
import type { KpiAimResponse } from "./kpi-aim.functions";
import { kpiRecordListParamsSchema } from "./kpi-record-list-params";
import type { KpiRecord } from "./kpi-records.functions";
import type { KpiSummaryResponse } from "./kpi-summary.functions";
import { listParamsSchema } from "./list-params";
import ky from "./ky";
import type {
	PaginatedResponse,
} from "./server-function-types";

export type Student = {
	id: string;
	identifier: string;
	email: string;
	firstName: string;
	lastName: string;
	role: number;
	intake: {
		id: number;
		name: string;
		startYear: number;
	} | null;
};

export type StudentOverview = {
	student: Student;
} & KpiSummaryResponse;

export type StudentCreateInput = {
	identifier: string;
	email: string;
	firstName: string;
	lastName: string;
	intakeBatchId: number;
	password: string;
};

export type StudentUpdateInput = {
	id: string;
	identifier: string;
	email: string;
	firstName: string;
	lastName: string;
	intakeBatchId?: number;
	password?: string;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getStudentsPageFn = createServerFn({ method: "GET" })
	.inputValidator((params: unknown) => listParamsSchema.parse(params))
	.handler(async ({ data: params }) => {
		const authToken = getCookie("AUTH_TOKEN");
		const searchParams: Record<string, string> = {
			page: String(params.page),
			limit: String(params.limit),
		};
		if (params.sortBy) searchParams.sortBy = params.sortBy;
		if (params.sortDir) searchParams.sortDir = params.sortDir;
		if (params.startYear) searchParams.startYear = String(params.startYear);
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/students`, {
				searchParams,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<PaginatedResponse<Student>>();
	});

export const getAdminStudentOverviewFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/students/${id}/overview`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<StudentOverview>();
	});

export const getAdminStudentAcademicsFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/students/${id}/academics`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<AcademicRecord[]>();
	});

export const getAdminStudentAcademicsSortedFn = createServerFn({
	method: "GET",
})
	.inputValidator((data: unknown) =>
		academicListParamsSchema.extend({ id: z.string().uuid() }).parse(data),
	)
	.handler(async ({ data: { id, ...params } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		const searchParams: Record<string, string> = {};
		if (params.sortBy) searchParams.sortBy = params.sortBy;
		if (params.sortDir) searchParams.sortDir = params.sortDir;
		if (params.semester) searchParams.semester = String(params.semester);

		return await ky
			.get(`${getApiBaseUrl()}/api/admin/students/${id}/academics`, {
				searchParams,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<AcademicRecord[]>();
	});

export const getAdminStudentKpiRecordsFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/students/${id}/kpi-records`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<KpiRecord[]>();
	});

export const getAdminStudentKpiRecordsPageFn = createServerFn({
	method: "GET",
})
	.inputValidator((data: unknown) =>
		kpiRecordListParamsSchema.extend({ id: z.string().uuid() }).parse(data),
	)
	.handler(async ({ data: { id, ...params } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		const searchParams: Record<string, string> = {
			page: String(params.page),
			limit: String(params.limit),
		};
		if (params.sortBy) searchParams.sortBy = params.sortBy;
		if (params.sortDir) searchParams.sortDir = params.sortDir;
		if (params.type) searchParams.type = params.type;
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/students/${id}/kpi-records/page`, {
				searchParams,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<PaginatedResponse<KpiRecord>>();
	});

export const getAdminStudentChallengesFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/students/${id}/challenges`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<Challenge[]>();
	});

export const getAdminStudentChallengesPageFn = createServerFn({
	method: "GET",
})
	.inputValidator((data: unknown) =>
		challengeListParamsSchema.extend({ id: z.string().uuid() }).parse(data),
	)
	.handler(async ({ data: { id, ...params } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		const searchParams: Record<string, string> = {
			page: String(params.page),
			limit: String(params.limit),
		};
		if (params.sortBy) searchParams.sortBy = params.sortBy;
		if (params.sortDir) searchParams.sortDir = params.sortDir;
		if (params.semester) searchParams.semester = String(params.semester);

		return await ky
			.get(`${getApiBaseUrl()}/api/admin/students/${id}/challenges/page`, {
				searchParams,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<PaginatedResponse<Challenge>>();
	});

export const getAdminStudentKpiTargetFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/students/${id}/kpi-target`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<KpiAimResponse>();
	});

export const createStudentFn = createServerFn({ method: "POST" })
	.inputValidator((data: StudentCreateInput) => data)
	.handler(async ({ data }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(`${getApiBaseUrl()}/api/admin/students`, {
				json: data,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; user: Student }>();
	});

export const updateStudentFn = createServerFn({ method: "POST" })
	.inputValidator((data: StudentUpdateInput) => data)
	.handler(async ({ data: { id, ...rest } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.patch(`${getApiBaseUrl()}/api/admin/students/${id}`, {
				json: rest,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; user: Student }>();
	});

export const deleteStudentFn = createServerFn({ method: "POST" })
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.delete(`${getApiBaseUrl()}/api/admin/students/${id}`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string }>();
	});
