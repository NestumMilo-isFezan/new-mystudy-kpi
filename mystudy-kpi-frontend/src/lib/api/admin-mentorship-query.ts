import { queryOptions } from "@tanstack/react-query";
import {
	getAdminMenteesFn,
	getStandardKpiTargetFn,
} from "./admin-mentorship.functions";

export const adminMenteesQueryOptions = queryOptions({
	queryKey: ["admin-mentees"] as const,
	queryFn: () => getAdminMenteesFn(),
});

export const adminStandardKpiTargetQueryOptions = (batchId: number) =>
	queryOptions({
		queryKey: ["admin-standard-kpi-target", batchId] as const,
		queryFn: () => getStandardKpiTargetFn({ data: batchId }),
		enabled: batchId > 0,
	});
