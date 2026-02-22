import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "./ky";

export interface UserSession {
	id: string;
	ip_address: string | null;
	user_agent: string | null;
	created_at: string;
	last_active_at: string | null;
	expires_at: string;
	is_current: boolean;
}

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getSessionsFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.get(`${getApiBaseUrl()}/api/sessions`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<UserSession[]>();
	},
);

export const revokeSessionFn = createServerFn({ method: "POST" })
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.delete(`${getApiBaseUrl()}/api/sessions/${id}`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string }>();
	});

export const revokeOtherSessionsFn = createServerFn({
	method: "POST",
}).handler(async () => {
	const authToken = getCookie("AUTH_TOKEN");
	return await ky
		.post(`${getApiBaseUrl()}/api/sessions/revoke-all-others`, {
			headers: {
				Accept: "application/json",
				Cookie: `AUTH_TOKEN=${authToken}`,
			},
		})
		.json<{ message: string }>();
});
