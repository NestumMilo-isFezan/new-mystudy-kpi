import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "ky";

export type AcademicRecord = {
	id: number;
	semester: number;
	academicYear: number;
	academicYearString: string;
	termString: string;
	isShortSemester: boolean;
	gpa: string | null;
};

export type SaveAcademicPayload = {
	semester: number;
	academicYear: number;
	gpa: string | null;
};

export type UpdateGpaPayload = {
	id: number;
	gpa: string | null;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getAcademicsFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");

		if (!authToken) {
			return [];
		}

		return await ky
			.get(`${getApiBaseUrl()}/api/student/academics`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<AcademicRecord[]>();
	},
);

export const saveAcademicFn = createServerFn({ method: "POST" })
	.inputValidator((data: SaveAcademicPayload) => data)
	.handler(async ({ data: payload }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(`${getApiBaseUrl()}/api/student/academics`, {
				json: payload,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; record: AcademicRecord }>();
	});

export const updateGpaFn = createServerFn({ method: "POST" })
	.inputValidator((data: UpdateGpaPayload) => data)
	.handler(async ({ data: { id, gpa } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.patch(`${getApiBaseUrl()}/api/student/academics/${id}`, {
				json: { gpa },
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; record: AcademicRecord }>();
	});
