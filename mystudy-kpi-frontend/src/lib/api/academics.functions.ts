import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import { HTTPError } from "ky";
import { academicListParamsSchema } from "./academic-list-params";
import ky from "./ky";

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
			return null;
		}

		try {
			return await ky
				.get(`${getApiBaseUrl()}/api/student/academics`, {
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				})
				.json<AcademicRecord[]>();
		} catch (error) {
			if (error instanceof HTTPError && error.response.status === 401) {
				return null;
			}

			throw error;
		}
	},
);

export const getAcademicsSortedFn = createServerFn({ method: "GET" })
	.inputValidator((params: unknown) => academicListParamsSchema.parse(params))
	.handler(async ({ data: params }) => {
		const authToken = getCookie("AUTH_TOKEN");

		if (!authToken) {
			return null;
		}

		const searchParams: Record<string, string> = {};
		if (params.sortBy) searchParams.sortBy = params.sortBy;
		if (params.sortDir) searchParams.sortDir = params.sortDir;
		if (params.semester) searchParams.semester = String(params.semester);

		try {
			return await ky
				.get(`${getApiBaseUrl()}/api/student/academics`, {
					searchParams,
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				})
				.json<AcademicRecord[]>();
		} catch (error) {
			if (error instanceof HTTPError && error.response.status === 401) {
				return null;
			}

			throw error;
		}
	});

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
