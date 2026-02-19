import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "ky";

export type Challenge = {
	id: number;
	challenge: string;
	plan: string;
	notes: string | null;
	semester: {
		id: number;
		semester: number;
		academicYear: number;
		termString: string;
	};
};

export type SaveChallengePayload = {
	semesterRecordId: number;
	challenge: string;
	plan: string;
	notes?: string | null;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getChallengesFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");

		if (!authToken) {
			return [];
		}

		return await ky
			.get(`${getApiBaseUrl()}/api/student/challenges`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<Challenge[]>();
	},
);

export const createChallengeFn = createServerFn({ method: "POST" })
	.inputValidator((data: SaveChallengePayload) => data)
	.handler(async ({ data: payload }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.post(`${getApiBaseUrl()}/api/student/challenges`, {
				json: payload,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; challenge: Challenge }>();
	});

export const updateChallengeFn = createServerFn({ method: "POST" })
	.inputValidator((data: { id: number; payload: SaveChallengePayload }) => data)
	.handler(async ({ data: { id, payload } }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.patch(`${getApiBaseUrl()}/api/student/challenges/${id}`, {
				json: payload,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; challenge: Challenge }>();
	});

export const deleteChallengeFn = createServerFn({ method: "POST" })
	.inputValidator((id: number) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.delete(`${getApiBaseUrl()}/api/student/challenges/${id}`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string }>();
	});
