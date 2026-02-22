import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";
import { academicListParamsSchema } from "./academic-list-params";
import { challengeListParamsSchema } from "./challenge-list-params";
import { kpiRecordListParamsSchema } from "./kpi-record-list-params";
import { mentorshipListParamsSchema } from "./mentorship-list-params";
import type { PaginatedResponse } from "./server-function-types";
import type { AcademicRecord } from "./academics.functions";
import type { Challenge } from "./challenges.functions";
import type {
	CertificateTargets,
	KpiAimResponse,
	LevelTargets,
} from "./kpi-aim.functions";
import type { KpiRecord } from "./kpi-records.functions";
import type { KpiSummaryResponse } from "./kpi-summary.functions";
import ky from "./ky";
import {
	positiveIntSchema,
	saveKpiAimPayloadSchema,
	uuidSchema,
} from "./schemas";
import type { Student, StudentCreateInput } from "./students.functions";

export type Mentorship = {
	id: number;
	intakeBatch: {
		id: number;
		name: string;
		startYear: number;
	};
	lecturer?: {
		id: string;
		identifier: string;
		firstName: string;
		lastName: string;
	};
	menteeCount: number;
	mentees: Student[];
};

export type SerializedKpiAim = {
	id: number;
	targetSetBy: "personal" | "lecturer" | "faculty";
	cgpa: string;
	activities: LevelTargets;
	competitions: LevelTargets;
	certificates: CertificateTargets;
};

export type StudentOverview = {
	student: Student;
} & KpiSummaryResponse;

export type MentorshipAssignInput = {
	batchId: number;
	studentIds: string[];
};

const mentorshipAssignInputSchema = z.object({
	batchId: positiveIntSchema,
	studentIds: z.array(uuidSchema).min(1),
});
const studentCreateInputSchema = z.object({
	identifier: z.string().trim().min(1),
	email: z.string().email(),
	firstName: z.string().trim().min(1),
	lastName: z.string().trim().min(1),
	intakeBatchId: positiveIntSchema,
	password: z.string().min(8),
});

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getLecturerMentorshipsFn = createServerFn({
	method: "GET",
}).handler(async () => {
	const authToken = getCookie("AUTH_TOKEN");
	return await ky
		.get(`${getApiBaseUrl()}/api/lecturer/mentorships`, {
			headers: {
				Accept: "application/json",
				Cookie: `AUTH_TOKEN=${authToken}`,
			},
		})
		.json<Mentorship[]>();
});

export const getAdminMentorshipsFn = createServerFn({
	method: "GET",
}).handler(async () => {
	const authToken = getCookie("AUTH_TOKEN");
	return await ky
		.get(`${getApiBaseUrl()}/api/admin/mentorships`, {
			headers: {
				Accept: "application/json",
				Cookie: `AUTH_TOKEN=${authToken}`,
			},
		})
		.json<Mentorship[]>();
});

export const getLecturerMentorshipsPageFn = createServerFn({ method: "GET" })
	.inputValidator((params: unknown) => mentorshipListParamsSchema.parse(params))
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
			.get(`${getApiBaseUrl()}/api/lecturer/mentorships/page`, {
				searchParams,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<PaginatedResponse<Mentorship>>();
	});

export const getAdminMentorshipsPageFn = createServerFn({ method: "GET" })
	.inputValidator((params: unknown) => mentorshipListParamsSchema.parse(params))
	.handler(async ({ data: params }) => {
		const authToken = getCookie("AUTH_TOKEN");
		const searchParams: Record<string, string> = {
			page: String(params.page),
			limit: String(params.limit),
		};
		if (params.sortBy) searchParams.sortBy = params.sortBy;
		if (params.sortDir) searchParams.sortDir = params.sortDir;
		if (params.startYear) searchParams.startYear = String(params.startYear);
		if (params.lecturerId) searchParams.lecturerId = params.lecturerId;

		return await ky
			.get(`${getApiBaseUrl()}/api/admin/mentorships/page`, {
				searchParams,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<PaginatedResponse<Mentorship>>();
	});

export const getAdminMentorshipByIdFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: number) => positiveIntSchema.parse(id))
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/mentorships/${id}`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<Mentorship>();
	});

export const assignMenteesAdminFn = createServerFn({ method: "POST" })
	.inputValidator((data: MentorshipAssignInput & { lecturerId: string }) =>
		z
			.object({
				batchId: positiveIntSchema,
				studentIds: z.array(uuidSchema).min(1),
				lecturerId: uuidSchema,
			})
			.parse(data),
	)
	.handler(async ({ data }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(`${getApiBaseUrl()}/api/admin/mentorships`, {
				json: data,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; mentorship: Mentorship }>();
	});

export const getMentorshipStudentOverviewFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: string) => uuidSchema.parse(id))
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(
				`${getApiBaseUrl()}/api/lecturer/mentorships/students/${id}/overview`,
				{
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<StudentOverview>();
	});

export const getMentorshipStudentAcademicsFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: string) => uuidSchema.parse(id))
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(
				`${getApiBaseUrl()}/api/lecturer/mentorships/students/${id}/academics`,
				{
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<AcademicRecord[]>();
	});

export const getMentorshipStudentAcademicsSortedFn = createServerFn({
	method: "GET",
})
	.inputValidator((data: unknown) =>
		academicListParamsSchema.extend({ id: uuidSchema }).parse(data),
	)
	.handler(async ({ data: { id, ...params } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		const searchParams: Record<string, string> = {};
		if (params.sortBy) searchParams.sortBy = params.sortBy;
		if (params.sortDir) searchParams.sortDir = params.sortDir;
		if (params.semester) searchParams.semester = String(params.semester);

		return await ky
			.get(
				`${getApiBaseUrl()}/api/lecturer/mentorships/students/${id}/academics`,
				{
					searchParams,
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<AcademicRecord[]>();
	});

export const getMentorshipStudentKpiRecordsFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: string) => uuidSchema.parse(id))
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(
				`${getApiBaseUrl()}/api/lecturer/mentorships/students/${id}/kpi-records`,
				{
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<KpiRecord[]>();
	});

export const getMentorshipStudentKpiRecordsPageFn = createServerFn({
	method: "GET",
})
	.inputValidator((data: unknown) =>
		kpiRecordListParamsSchema.extend({ id: uuidSchema }).parse(data),
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
			.get(
				`${getApiBaseUrl()}/api/lecturer/mentorships/students/${id}/kpi-records/page`,
				{
					searchParams,
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<PaginatedResponse<KpiRecord>>();
	});

export const getMentorshipStudentChallengesFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: string) => uuidSchema.parse(id))
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(
				`${getApiBaseUrl()}/api/lecturer/mentorships/students/${id}/challenges`,
				{
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<Challenge[]>();
	});

export const getMentorshipStudentChallengesPageFn = createServerFn({
	method: "GET",
})
	.inputValidator((data: unknown) =>
		challengeListParamsSchema.extend({ id: uuidSchema }).parse(data),
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
			.get(
				`${getApiBaseUrl()}/api/lecturer/mentorships/students/${id}/challenges/page`,
				{
					searchParams,
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<PaginatedResponse<Challenge>>();
	});

export const getMentorshipStudentKpiTargetFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: string) => uuidSchema.parse(id))
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(
				`${getApiBaseUrl()}/api/lecturer/mentorships/students/${id}/kpi-target`,
				{
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<KpiAimResponse>();
	});

export const updateMenteeKpiTargetFn = createServerFn({
	method: "POST",
})
	.inputValidator(
		z.object({
			studentId: uuidSchema,
			payload: saveKpiAimPayloadSchema,
		}),
	)
	.handler(async ({ data: { studentId, payload } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(
				`${getApiBaseUrl()}/api/lecturer/mentorships/students/${studentId}/kpi-target`,
				{
					json: payload,
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<{ message: string; aim: SerializedKpiAim }>();
	});

export const updateStandardKpiTargetFn = createServerFn({
	method: "POST",
})
	.inputValidator(
		z.object({
			batchId: positiveIntSchema,
			payload: saveKpiAimPayloadSchema,
		}),
	)
	.handler(async ({ data: { batchId, payload } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(
				`${getApiBaseUrl()}/api/admin/mentorships/standard-aims/${batchId}`,
				{
					json: payload,
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<{ message: string; aim: SerializedKpiAim }>();
	});

export const getLecturerMentorshipByIdFn = createServerFn({
	method: "GET",
})
	.inputValidator((id: number) => positiveIntSchema.parse(id))
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/lecturer/mentorships/${id}`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<Mentorship>();
	});

export const getAvailableStudentsFn = createServerFn({ method: "GET" })
	.inputValidator((batchId: number) => positiveIntSchema.parse(batchId))
	.handler(async ({ data: batchId }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(
				`${getApiBaseUrl()}/api/lecturer/mentorships/available-students/${batchId}`,
				{
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<Student[]>();
	});

export const getAvailableStudentsAdminFn = createServerFn({ method: "GET" })
	.inputValidator((batchId: number) => positiveIntSchema.parse(batchId))
	.handler(async ({ data: batchId }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(
				`${getApiBaseUrl()}/api/admin/mentorships/available-students/${batchId}`,
				{
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<Student[]>();
	});

export const assignMenteesFn = createServerFn({ method: "POST" })
	.inputValidator((data: MentorshipAssignInput) =>
		mentorshipAssignInputSchema.parse(data),
	)
	.handler(async ({ data }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(`${getApiBaseUrl()}/api/lecturer/mentorships`, {
				json: data,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; mentorship: Mentorship }>();
	});

export const deleteMenteeFn = createServerFn({ method: "POST" })
	.inputValidator((id: string) => uuidSchema.parse(id))
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.delete(`${getApiBaseUrl()}/api/lecturer/mentorships/mentees/${id}`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string }>();
	});

export const deleteMenteeAdminFn = createServerFn({ method: "POST" })
	.inputValidator((id: string) => uuidSchema.parse(id))
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.delete(`${getApiBaseUrl()}/api/admin/mentorships/mentees/${id}`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string }>();
	});

export const deleteMentorshipFn = createServerFn({ method: "POST" })
	.inputValidator((id: number) => positiveIntSchema.parse(id))
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.delete(
				`${getApiBaseUrl()}/api/lecturer/mentorships/mentorship-records/${id}`,
				{
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<{ message: string }>();
	});

export const quickCreateStudentFn = createServerFn({ method: "POST" })
	.inputValidator((data: StudentCreateInput) =>
		studentCreateInputSchema.parse(data),
	)
	.handler(async ({ data }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(`${getApiBaseUrl()}/api/lecturer/mentorships/quick-student`, {
				json: data,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; user: Student }>();
	});
