import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import { intakeListParamsSchema } from "./intake-list-params";
import ky from "./ky";
import type { PaginatedResponse } from "./server-function-types";

export type IntakeBatch = {
	id: number;
	name: string;
	startYear: number;
	isActive: boolean;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getIntakeBatchesFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/intake-batches`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<IntakeBatch[]>();
	},
);

export const getAllIntakeBatchesFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/admin/intake-batches`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<IntakeBatch[]>();
	},
);

export const getIntakeBatchesPageFn = createServerFn({ method: "GET" })
	.inputValidator((params: unknown) => intakeListParamsSchema.parse(params))
	.handler(async ({ data: params }) => {
		const authToken = getCookie("AUTH_TOKEN");
		const searchParams: Record<string, string> = {
			page: String(params.page),
			limit: String(params.limit),
		};
		if (params.sortBy) searchParams.sortBy = params.sortBy;
		if (params.sortDir) searchParams.sortDir = params.sortDir;
		if (params.status) searchParams.status = params.status;

		return await ky
			.get(`${getApiBaseUrl()}/api/admin/intake-batches/page`, {
				searchParams,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<PaginatedResponse<IntakeBatch>>();
	});

export const createIntakeBatchFn = createServerFn({ method: "POST" })
	.inputValidator((startYear: number) => startYear)
	.handler(async ({ data: startYear }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(`${getApiBaseUrl()}/api/admin/intake-batches`, {
				json: { startYear },
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; batch: IntakeBatch }>();
	});

export const updateIntakeBatchFn = createServerFn({ method: "POST" })
	.inputValidator((data: { id: number; startYear: number }) => data)
	.handler(async ({ data: { id, startYear } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.patch(`${getApiBaseUrl()}/api/admin/intake-batches/${id}`, {
				json: { startYear },
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; batch: IntakeBatch }>();
	});

export const toggleIntakeBatchStatusFn = createServerFn({
	method: "POST",
})
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.patch(`${getApiBaseUrl()}/api/admin/intake-batches/${id}/toggle`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; batch: IntakeBatch }>();
	});

export const deleteIntakeBatchFn = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.delete(`${getApiBaseUrl()}/api/admin/intake-batches/${id}`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string }>();
	});
