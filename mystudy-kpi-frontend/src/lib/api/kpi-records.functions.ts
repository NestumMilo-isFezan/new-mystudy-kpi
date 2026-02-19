import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "ky";

export type KpiRecord = {
	id: number;
	type: "activity" | "competition" | "certification";
	title: string;
	description: string | null;
	level: number | null;
	category: number | null;
	tags: string[] | null;
	notes: string | null;
	semester: {
		id: number;
		semester: number;
		academicYear: number;
		termString: string;
	};
};

export type SaveKpiRecordPayload = {
	semesterRecordId?: number;
	type: string;
	title: string;
	description?: string | null;
	level?: number | null;
	category?: number | null;
	tags?: string[] | null;
	notes?: string | null;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getKpiRecordsFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");

		if (!authToken) {
			return [];
		}

		return await ky
			.get(`${getApiBaseUrl()}/api/student/kpi-records`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<KpiRecord[]>();
	},
);

export const createKpiRecordFn = createServerFn({ method: "POST" })
	.inputValidator((data: SaveKpiRecordPayload) => data)
	.handler(async ({ data: payload }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(`${getApiBaseUrl()}/api/student/kpi-records`, {
				json: payload,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; record: KpiRecord }>();
	});

export const updateKpiRecordFn = createServerFn({ method: "POST" })
	.inputValidator((data: { id: number; payload: SaveKpiRecordPayload }) => data)
	.handler(async ({ data: { id, payload } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.patch(`${getApiBaseUrl()}/api/student/kpi-records/${id}`, {
				json: payload,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; record: KpiRecord }>();
	});

export const deleteKpiRecordFn = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.delete(`${getApiBaseUrl()}/api/student/kpi-records/${id}`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string }>();
	});
