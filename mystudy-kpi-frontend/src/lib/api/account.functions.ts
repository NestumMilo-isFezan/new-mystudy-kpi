import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "ky";
import type { AuthUser } from "./auth.functions";

export type AccountUpdatePayload = {
	intakeBatchId: string;
};

export type PasswordUpdatePayload = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export type AccountUpdateResponse = {
	message: string;
	user: AuthUser;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const updateAccountFn = createServerFn({ method: "POST" })
	.inputValidator((data: AccountUpdatePayload) => data)
	.handler(async ({ data: payload }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.patch(`${getApiBaseUrl()}/api/account`, {
				json: payload,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<AccountUpdateResponse>();
	});

export const updatePasswordFn = createServerFn({ method: "POST" })
	.inputValidator((data: PasswordUpdatePayload) => data)
	.handler(async ({ data: payload }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.patch(`${getApiBaseUrl()}/api/account/password`, {
				json: payload,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string }>();
	});

export const deleteAccountFn = createServerFn({ method: "POST" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.delete(`${getApiBaseUrl()}/api/account`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string }>();
	},
);
