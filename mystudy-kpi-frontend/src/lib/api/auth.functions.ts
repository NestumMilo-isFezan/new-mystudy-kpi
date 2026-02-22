import { createServerFn } from "@tanstack/react-start";
import {
	deleteCookie,
	getCookie,
	getRequestUrl,
	setCookie,
} from "@tanstack/react-start/server";
import ky from "./ky";

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

type AuthCookieOptions = {
	path: string;
	httpOnly: boolean;
	sameSite: "lax" | "strict" | "none";
	secure?: boolean;
	maxAge?: number;
	expires?: Date;
	domain?: string;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

function parseAuthCookie(setCookieHeader: string): {
	value: string;
	options: AuthCookieOptions;
} | null {
	const [rawNameValue, ...attributePairs] = setCookieHeader
		.split(";")
		.map((part) => part.trim());

	const equalsIndex = rawNameValue.indexOf("=");
	if (equalsIndex === -1) {
		return null;
	}

	const name = rawNameValue.slice(0, equalsIndex);
	const value = rawNameValue.slice(equalsIndex + 1);
	if (name !== "AUTH_TOKEN" || !value) {
		return null;
	}

	const options: AuthCookieOptions = {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
	};

	for (const pair of attributePairs) {
		const [rawAttribute, rawAttributeValue] = pair.split("=", 2);
		const attribute = rawAttribute.toLowerCase();
		const attributeValue = rawAttributeValue?.trim();

		if (attribute === "secure") {
			options.secure = true;
			continue;
		}

		if (!attributeValue) {
			continue;
		}

		if (attribute === "path") {
			options.path = attributeValue;
			continue;
		}

		if (attribute === "samesite") {
			const sameSite = attributeValue.toLowerCase();
			if (sameSite === "strict" || sameSite === "none" || sameSite === "lax") {
				options.sameSite = sameSite;
			}
			continue;
		}

		if (attribute === "max-age") {
			const maxAge = Number.parseInt(attributeValue, 10);
			if (!Number.isNaN(maxAge)) {
				options.maxAge = maxAge;
			}
			continue;
		}

		if (attribute === "expires") {
			const expires = new Date(attributeValue);
			if (!Number.isNaN(expires.getTime())) {
				options.expires = expires;
			}
			continue;
		}

		if (attribute === "domain") {
			options.domain = attributeValue;
		}
	}

	return {
		value,
		options,
	};
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
			const parsedCookie = parseAuthCookie(setCookieHeader);
			if (parsedCookie) {
				setCookie("AUTH_TOKEN", parsedCookie.value, parsedCookie.options);
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
		const headers: Record<string, string> = {
			Accept: "application/json",
		};

		if (authToken) {
			headers.Cookie = `AUTH_TOKEN=${authToken}`;
		}

		await ky.post(`${getApiBaseUrl()}/api/logout`, {
			headers,
		});
	} catch (_error) {
		// Ignore backend logout failures, we still want to clear the local cookie
	}

	deleteCookie("AUTH_TOKEN");

	return { message: "Logout successful." };
});
