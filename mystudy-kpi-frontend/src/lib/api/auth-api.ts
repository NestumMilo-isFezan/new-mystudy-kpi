import { postRequest } from "./http-client";

export type AuthUser = {
	id: string;
	identifier: string;
	email: string;
	role: number;
};

type AuthResponse = {
	message: string;
	user: AuthUser;
};

type LogoutResponse = {
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

export function login(payload: LoginPayload) {
	return postRequest<AuthResponse, LoginPayload>("/api/login", payload);
}

export function register(payload: RegisterPayload) {
	return postRequest<AuthResponse, RegisterPayload>("/api/register", payload);
}

export function logout() {
	return postRequest<LogoutResponse, Record<string, never>>("/api/logout", {});
}
