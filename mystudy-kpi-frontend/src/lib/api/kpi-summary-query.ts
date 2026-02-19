import { queryOptions } from "@tanstack/react-query";
import { getKpiSummaryFn } from "./kpi-summary.functions";

export const kpiSummaryQueryOptions = queryOptions({
	queryKey: ["kpi-summary"],
	queryFn: () => getKpiSummaryFn(),
});
