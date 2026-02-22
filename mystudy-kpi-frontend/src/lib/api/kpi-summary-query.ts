import { queryOptions } from "@tanstack/react-query";
import { getKpiSummaryFn } from "./kpi-summary.functions";

export const kpiSummaryQueryOptions = queryOptions({
	queryKey: ["kpi-summary"] as const,
	queryFn: async () => {
		const summary = await getKpiSummaryFn();
		if (!summary) {
			throw new Error("Unauthorized");
		}

		return summary;
	},
	staleTime: 5 * 60 * 1000, // 5 minutes
	gcTime: 10 * 60 * 1000, // 10 minutes
});
