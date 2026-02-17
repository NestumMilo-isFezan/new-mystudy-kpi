import ky, { HTTPError, type Options } from "ky";

type ErrorPayload = {
	message?: string;
};

export class ApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly payload?: unknown,
	) {
		super(message);
		this.name = "ApiError";
	}
}

const http = ky.create({
	credentials: "include",
	retry: 0,
	timeout: 15_000,
	headers: {
		Accept: "application/json",
	},
});

async function toApiError(error: unknown): Promise<ApiError> {
	if (error instanceof HTTPError) {
		let payload: unknown;

		try {
			payload = (await error.response.clone().json()) as ErrorPayload;
		} catch {
			payload = undefined;
		}

		const message =
			typeof payload === "object" &&
			payload !== null &&
			"message" in payload &&
			typeof payload.message === "string"
				? payload.message
				: error.message;

		return new ApiError(message, error.response.status, payload);
	}

	if (error instanceof Error) {
		return new ApiError(error.message, 0);
	}

	return new ApiError("Unexpected request error.", 0);
}

async function request<TResponse>(
	path: string,
	options?: Options,
): Promise<TResponse> {
	try {
		return await http(path, options).json<TResponse>();
	} catch (error) {
		throw await toApiError(error);
	}
}

export function getRequest<TResponse>(path: string, options?: Options) {
	return request<TResponse>(path, { ...options, method: "GET" });
}

export function postRequest<TResponse, TBody>(
	path: string,
	json: TBody,
	options?: Options,
) {
	return request<TResponse>(path, { ...options, method: "POST", json });
}

export function putRequest<TResponse, TBody>(
	path: string,
	json: TBody,
	options?: Options,
) {
	return request<TResponse>(path, { ...options, method: "PUT", json });
}

export function isApiError(error: unknown): error is ApiError {
	return error instanceof ApiError;
}
