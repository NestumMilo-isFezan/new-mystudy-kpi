import { queryOptions } from "@tanstack/react-query";
import { getKpiAimFn, type KpiAimResponse } from "./kpi-aim.functions";

export type { KpiAimResponse };

export const kpiAimQueryOptions = queryOptions({
	queryKey: ["kpi-aim"] as const,
	queryFn: () => getKpiAimFn(),
	staleTime: 5 * 60 * 1000,
	retry: false,
});
