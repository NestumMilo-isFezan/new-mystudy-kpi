import { queryOptions } from "@tanstack/react-query";
import type { AcademicListParams } from "./academic-list-params";
import {
	type AcademicRecord,
	getAcademicsFn,
	getAcademicsSortedFn,
} from "./academics.functions";

export type { AcademicRecord };

export const academicsQueryOptions = queryOptions({
	queryKey: ["academics"] as const,
	queryFn: async () => (await getAcademicsFn()) ?? [],
	staleTime: 5 * 60 * 1000, // 5 minutes
	retry: false,
});

export const academicsSortedQueryOptions = (params: AcademicListParams) =>
	queryOptions({
		queryKey: ["academics", "sorted", params] as const,
		queryFn: async () => (await getAcademicsSortedFn({ data: params })) ?? [],
		staleTime: 30_000,
		retry: false,
	});
