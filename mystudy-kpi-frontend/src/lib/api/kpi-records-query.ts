import { queryOptions } from "@tanstack/react-query";
import { getKpiRecordsFn, type KpiRecord } from "./kpi-records.functions";

export type { KpiRecord };

export const kpiRecordsQueryOptions = queryOptions({
	queryKey: ["kpi-records"] as const,
	queryFn: () => getKpiRecordsFn(),
	staleTime: 5 * 60 * 1000, // 5 minutes
	retry: false,
});
