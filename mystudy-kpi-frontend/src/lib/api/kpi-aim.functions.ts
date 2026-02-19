import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "ky";

export type LevelTargets = {
	faculty: number;
	university: number;
	local: number;
	national: number;
	international: number;
};

export type CertificateTargets = {
	professional: number;
	technical: number;
};

export type KpiAimNode = {
	sourceType: "personal" | "lecturer" | "faculty";
	cgpa: string;
	activities: LevelTargets;
	competitions: LevelTargets;
	certificates: CertificateTargets;
	source?: string;
	isCustomized?: boolean;
	lastUpdated?: string | null;
};

export type KpiAimResponse = {
	personal: KpiAimNode | null;
	lecturer: KpiAimNode | null;
	batch: KpiAimNode | null;
	actual: {
		cgpa: string | null;
		activities: LevelTargets;
		competitions: LevelTargets;
		certificates: CertificateTargets;
	};
};

export type SaveKpiAimPayload = {
	cgpa: string;
	activities: LevelTargets;
	competitions: LevelTargets;
	certificates: CertificateTargets;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getKpiAimFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");

		if (!authToken) {
			return {
				personal: null,
				lecturer: null,
				batch: null,
				actual: {
					cgpa: null,
					activities: {
						faculty: 0,
						university: 0,
						local: 0,
						national: 0,
						international: 0,
					},
					competitions: {
						faculty: 0,
						university: 0,
						local: 0,
						national: 0,
						international: 0,
					},
					certificates: {
						professional: 0,
						technical: 0,
					},
				},
			} as KpiAimResponse;
		}

		return await ky
			.get(`${getApiBaseUrl()}/api/student/kpi-aim`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<KpiAimResponse>();
	},
);

export const updateKpiAimFn = createServerFn({ method: "POST" })
	.inputValidator((payload: SaveKpiAimPayload) => payload)
	.handler(async ({ data: payload }) => {
		const authToken = getCookie("AUTH_TOKEN");

		return await ky
			.put(`${getApiBaseUrl()}/api/student/kpi-aim`, {
				json: payload,
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<{ message: string; aim: KpiAimResponse }>();
	});
