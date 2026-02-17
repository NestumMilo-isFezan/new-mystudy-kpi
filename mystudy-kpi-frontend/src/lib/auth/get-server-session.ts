import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky, { HTTPError } from "ky";

import type { SessionResponse } from "@/lib/api/profile-api";

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}

	return getRequestUrl().origin;
}

export class SessionFetchError extends Error {
	constructor(
		message: string,
		public readonly causeValue?: unknown,
	) {
		super(message);
		this.name = "SessionFetchError";
	}
}

export const getServerSession = createServerFn({ method: "GET" }).handler(
	async (): Promise<SessionResponse | null> => {
		const authToken = getCookie("AUTH_TOKEN");

		if (!authToken) {
			return null;
		}

		try {
			const response = await ky.get(`${getApiBaseUrl()}/api/profile`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			});

			return (await response.json()) as SessionResponse;
		} catch (error) {
			if (error instanceof HTTPError && error.response.status === 401) {
				return null;
			}

			throw new SessionFetchError("Unable to load session.", error);
		}
	},
);
