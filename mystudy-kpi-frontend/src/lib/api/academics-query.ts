import { queryOptions } from "@tanstack/react-query";
import { type AcademicRecord, getAcademicsFn } from "./academics.functions";

export type { AcademicRecord };

export const academicsQueryOptions = queryOptions({
	queryKey: ["academics"],
	queryFn: () => getAcademicsFn(),
	staleTime: 5 * 60 * 1000, // 5 minutes
	retry: false,
});
