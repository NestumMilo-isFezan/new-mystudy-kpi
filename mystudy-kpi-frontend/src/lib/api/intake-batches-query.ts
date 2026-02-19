import { queryOptions } from "@tanstack/react-query";
import {
	getAllIntakeBatchesFn,
	getIntakeBatchesFn,
	type IntakeBatch,
} from "./intake-batches.functions";

export type { IntakeBatch };

export const intakeBatchesQueryOptions = queryOptions({
	queryKey: ["intake-batches"],
	queryFn: () => getIntakeBatchesFn(),
	staleTime: 5 * 60 * 1000, // 5 minutes
	retry: false,
});

export const allIntakeBatchesQueryOptions = queryOptions({
	queryKey: ["admin", "intake-batches"],
	queryFn: () => getAllIntakeBatchesFn(),
	staleTime: 5 * 60 * 1000, // 5 minutes
	retry: false,
});
