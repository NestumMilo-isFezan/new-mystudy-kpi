import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "ky";
import { z } from "zod";
import type { Student, StudentCreateInput } from "./students.functions";

export type Mentorship = {
	id: number;
	intakeBatch: {
		id: number;
		name: string;
		startYear: number;
	};
	menteeCount: number;
	mentees: Student[];
};

export type MentorshipAssignInput = {
	batchId: number;
	studentIds: string[];
};

const positiveIntSchema = z.number().int().positive();
const uuidSchema = z.string().uuid();
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
