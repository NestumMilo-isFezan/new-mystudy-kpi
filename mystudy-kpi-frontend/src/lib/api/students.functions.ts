import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "ky";
import type { AcademicRecord } from "./academics.functions";
import type { Challenge } from "./challenges.functions";
import type { KpiAimResponse } from "./kpi-aim.functions";
import type { KpiRecord } from "./kpi-records.functions";
import type { KpiSummaryResponse } from "./kpi-summary.functions";

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

export const getAllStudentsFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/students`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<Student[]>();
	},
);

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
