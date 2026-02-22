import { queryOptions } from "@tanstack/react-query";
import type { IntakeListParams } from "./intake-list-params";
import {
	getAllIntakeBatchesFn,
	getIntakeBatchesFn,
	getIntakeBatchesPageFn,
	type IntakeBatch,
} from "./intake-batches.functions";

export type { IntakeBatch };

export const intakeBatchesQueryOptions = queryOptions({
	queryKey: ["intake-batches"] as const,
	queryFn: () => getIntakeBatchesFn(),
	staleTime: 5 * 60 * 1000, // 5 minutes
	retry: false,
});

export const allIntakeBatchesQueryOptions = queryOptions({
	queryKey: ["admin", "intake-batches"] as const,
	queryFn: () => getAllIntakeBatchesFn(),
	staleTime: 5 * 60 * 1000, // 5 minutes
	retry: false,
});

export const intakeBatchesPageQueryOptions = (params: IntakeListParams) =>
	queryOptions({
		queryKey: ["admin", "intake-batches", "page", params] as const,
		queryFn: () => getIntakeBatchesPageFn({ data: params }),
		staleTime: 30_000,
		retry: false,
	});
