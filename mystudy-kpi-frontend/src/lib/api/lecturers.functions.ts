import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "ky";

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
			.get(`${getApiBaseUrl()}/api/admin/lecturers`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<Lecturer[]>();
	},
);

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
