import type { AuthUser } from "./auth-api";
import { getRequest, putRequest } from "./http-client";

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

type SaveProfileResponse = SessionResponse & {
	message: string;
};

export type SaveProfilePayload = {
	firstName: string;
	lastName: string;
	bio: string | null;
	birthDate: string | null;
	birthPlace: string | null;
};

export function getProfile() {
	return getRequest<SessionResponse>("/api/profile");
}

export function saveProfile(payload: SaveProfilePayload) {
	return putRequest<SaveProfileResponse, SaveProfilePayload>(
		"/api/profile",
		payload,
	);
}
