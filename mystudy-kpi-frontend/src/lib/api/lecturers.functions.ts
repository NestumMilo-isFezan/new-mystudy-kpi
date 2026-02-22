import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import { listParamsSchema } from "./list-params";
import ky from "./ky";
import type {
	PaginatedResponse,
} from "./server-function-types";

export type Lecturer = {
	id: string;
	identifier: string;
	email: string;
	firstName: string;
	lastName: string;
	role: number;
	intakeBatchId: number | null;
};

export type LecturerCreateInput = {
	identifier: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
};

export type LecturerUpdateInput = {
	id: string;
	identifier: string;
	email: string;
	firstName: string;
	lastName: string;
	password?: string;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getAllLecturersFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/lecturers/all`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<Lecturer[]>();
	},
);

export const getLecturersPageFn = createServerFn({ method: "GET" })
	.inputValidator((params: unknown) => listParamsSchema.parse(params))
	.handler(async ({ data: params }) => {
		const authToken = getCookie("AUTH_TOKEN");
		const searchParams: Record<string, string> = {
			page: String(params.page),
			limit: String(params.limit),
		};
		if (params.sortBy) searchParams.sortBy = params.sortBy;
		if (params.sortDir) searchParams.sortDir = params.sortDir;
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/lecturers`, {
				searchParams,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<PaginatedResponse<Lecturer>>();
	});

export const createLecturerFn = createServerFn({ method: "POST" })
	.inputValidator((data: LecturerCreateInput) => data)
	.handler(async ({ data }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(`${getApiBaseUrl()}/api/admin/lecturers`, {
				json: data,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; user: Lecturer }>();
	});

export const updateLecturerFn = createServerFn({ method: "POST" })
	.inputValidator((data: LecturerUpdateInput) => data)
	.handler(async ({ data: { id, ...rest } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.patch(`${getApiBaseUrl()}/api/admin/lecturers/${id}`, {
				json: rest,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; user: Lecturer }>();
	});

export const deleteLecturerFn = createServerFn({ method: "POST" })
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.delete(`${getApiBaseUrl()}/api/admin/lecturers/${id}`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string }>();
	});
