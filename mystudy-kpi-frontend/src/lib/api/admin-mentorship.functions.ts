import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "ky";
import { z } from "zod";
import type { SerializedKpiAim } from "./mentorships.functions";
import { uuidSchema } from "./schemas";
import type { Student } from "./students.functions";

export type AdminMenteeRecord = {
	student: Student;
	lecturer: {
		id: string;
		identifier: string;
		email: string;
		firstName: string;
		lastName: string;
		role: number;
	};
	batch: {
		id: number;
		name: string;
	};
	notes: string | null;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getAdminMenteesFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/mentorships/mentees`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<AdminMenteeRecord[]>();
	},
);

export const getStandardKpiTargetFn = createServerFn({ method: "GET" })
	.inputValidator((batchId: number) => z.number().int().parse(batchId))
	.handler(async ({ data: batchId }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(
				`${getApiBaseUrl()}/api/admin/mentorships/standard-aims/${batchId}`,
				{
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<SerializedKpiAim | null>();
	});

export const updateAdminMenteeNotesFn = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			studentId: uuidSchema,
			notes: z.string().nullable(),
		}),
	)
	.handler(async ({ data: { studentId, notes } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.patch(
				`${getApiBaseUrl()}/api/admin/mentorships/mentees/${studentId}/notes`,
				{
					json: { notes },
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				},
			)
			.json<{ message: string }>();
	});
