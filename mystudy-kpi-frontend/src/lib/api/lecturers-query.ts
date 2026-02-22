import { queryOptions } from "@tanstack/react-query";
import type { ListParams } from "./list-params";
import { getAllLecturersFn, getLecturersPageFn } from "./lecturers.functions";

export const allLecturersQueryOptions = queryOptions({
	queryKey: ["lecturers", "all"] as const,
	queryFn: () => getAllLecturersFn(),
});

export const lecturersPageQueryOptions = (params: ListParams) =>
	queryOptions({
		queryKey: ["lecturers", "page", params] as const,
		queryFn: () => getLecturersPageFn({ data: params }),
		staleTime: 30_000,
	});
