import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestUrl } from "@tanstack/react-start/server";
import ky from "ky";

export type KpiCategoryCounts = {
	faculty: number;
	university: number;
	local: number;
	national: number;
	international: number;
};

export type KpiCertCounts = {
	professional: number;
	technical: number;
};

export type KpiActual = {
	cgpa: string | null;
	activities: KpiCategoryCounts;
	competitions: KpiCategoryCounts;
	certificates: KpiCertCounts;
};

export type KpiGaps = {
	cgpa: number | null;
	activities: Record<keyof KpiCategoryCounts, number>;
	competitions: Record<keyof KpiCategoryCounts, number>;
	certificates: Record<keyof KpiCertCounts, number>;
};

export type KpiSummaryResponse = {
	actual: KpiActual;
	gaps: KpiGaps;
	targetSource: string | null;
};

function getApiBaseUrl() {
	if (process.env.PUBLIC_API_BASE_URL) {
		return process.env.PUBLIC_API_BASE_URL;
	}
	return getRequestUrl().origin;
}

export const getKpiSummaryFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const authToken = getCookie("AUTH_TOKEN");

		if (!authToken) {
			throw new Error("Unauthorized");
		}

		return await ky
			.get(`${getApiBaseUrl()}/api/student/kpi-summary`, {
				headers: {
					Accept: "application/json",
					Cookie: `AUTH_TOKEN=${authToken}`,
				},
			})
			.json<KpiSummaryResponse>();
	},
);
