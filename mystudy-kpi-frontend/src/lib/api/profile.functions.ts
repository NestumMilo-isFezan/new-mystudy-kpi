import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import { HTTPError } from "ky";
import type { AuthUser } from "./auth.functions";
import ky from "./ky";

export type UserProfile = {
	id: string;
	firstName: string;
	lastName: string;
	bio: string | null;
	birthDate: string | null;
	birthPlace: string | null;
};

export type SessionResponse = {
	user: AuthUser;
	profile: UserProfile | null;
};

export type SaveProfileResponse = SessionResponse & {
	message: string;
};

export type SaveProfilePayload = {
	firstName: string;
	lastName: string;
	bio: string | null;
	birthDate: string | null;
	birthPlace: string | null;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getProfileFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");

		if (!authToken) {
			return null;
		}

		try {
			return await ky
				.get(`${getApiBaseUrl()}/api/profile`, {
					headers: {
						Accept: "application/json",
						Cookie: `AUTH_TOKEN=${authToken}`,
					},
				})
				.json<SessionResponse>();
		} catch (error) {
			if (error instanceof HTTPError && error.response.status === 401) {
				return null;
			}
			throw new Error("Unable to load session.");
		}
	},
);

export const saveProfileFn = createServerFn({ method: "POST" })
	.inputValidator((data: SaveProfilePayload) => data)
	.handler(async ({ data: payload }) => {
		const authToken = getCookie("AUTH_TOKEN");
		return await ky
			.put(`${getApiBaseUrl()}/api/profile`, {
				json: payload,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<SaveProfileResponse>();
	});
