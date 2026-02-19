import { createServerFn } from "@tanstack/react-start";
import {
	deleteCookie,
	getCookie,
	getRequestUrl,
	setCookie,
} from "@tanstack/react-start/server";
import ky from "ky";

export type AuthUser = {
	id: string;
	identifier: string;
	email: string;
	firstName?: string;
	lastName?: string;
	role: number;
	intake?: {
		id: number;
		name: string;
		startYear: number;
	} | null;
};

export type AuthResponse = {
	message: string;
	user: AuthUser;
};

export type LogoutResponse = {
	message: string;
};

export type LoginPayload = {
	identifier: string;
	password: string;
};

export type RegisterPayload = {
	identifier: string;
	email: string;
	password: string;
	intakeBatchId: number;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const loginFn = createServerFn({ method: "POST" })
	.inputValidator((data: LoginPayload) => data)
	.handler(async ({ data: payload }) => {
		const response = await ky.post(`${getApiBaseUrl()}/api/login`, {
			json: payload,
			headers: {
				Accept: "application/json",
			},
		});

		// Proxy the AUTH_TOKEN cookie from backend to browser
		const setCookieHeader = response.headers.get("set-cookie");
		if (setCookieHeader) {
			const match = setCookieHeader.match(/AUTH_TOKEN=([^;]+)/);
			if (match?.[1]) {
				setCookie("AUTH_TOKEN", match[1], {
					path: "/",
					httpOnly: true,
					sameSite: "lax",
					maxAge: 30 * 24 * 60 * 60, // 30 days
				});
			}
		}

		return await response.json<AuthResponse>();
	});

export const registerFn = createServerFn({ method: "POST" })
	.inputValidator((data: RegisterPayload) => data)
	.handler(async ({ data: payload }) => {
		return await ky
			.post(`${getApiBaseUrl()}/api/register`, {
				json: payload,
				headers: {
					Accept: "application/json",
				},
			})
			.json<AuthResponse>();
	});

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
	const authToken = getCookie("AUTH_TOKEN");

	try {
		await ky.post(`${getApiBaseUrl()}/api/logout`, {
			headers: {
				Accept: "application/json",
				Cookie: `AUTH_TOKEN=${authToken}`,
			},
		});
	} catch (_error) {
		// Ignore backend logout failures, we still want to clear the local cookie
	}

	deleteCookie("AUTH_TOKEN");

	return { message: "Logout successful." };
});
