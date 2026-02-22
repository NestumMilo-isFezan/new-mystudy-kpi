import { queryOptions } from "@tanstack/react-query";
import type { KpiRecordListParams } from "./kpi-record-list-params";
import {
	getKpiRecordsFn,
	getKpiRecordsPageFn,
	type KpiRecord,
} from "./kpi-records.functions";

export type { KpiRecord };

export const kpiRecordsQueryOptions = queryOptions({
	queryKey: ["kpi-records"] as const,
	queryFn: () => getKpiRecordsFn(),
	staleTime: 5 * 60 * 1000, // 5 minutes
	retry: false,
});

export const kpiRecordsPageQueryOptions = (params: KpiRecordListParams) =>
	queryOptions({
		queryKey: ["kpi-records", "page", params] as const,
		queryFn: () => getKpiRecordsPageFn({ data: params }),
		staleTime: 30_000,
	});
