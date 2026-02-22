import { queryOptions } from "@tanstack/react-query";
import type { ChallengeListParams } from "./challenge-list-params";
import {
	type Challenge,
	getChallengesFn,
	getChallengesPageFn,
} from "./challenges.functions";

export type { Challenge };

export const challengesQueryOptions = queryOptions({
	queryKey: ["challenges"] as const,
	queryFn: () => getChallengesFn(),
	staleTime: 5 * 60 * 1000, // 5 minutes
	gcTime: 10 * 60 * 1000, // 10 minutes
});

export const challengesPageQueryOptions = (params: ChallengeListParams) =>
	queryOptions({
		queryKey: ["challenges", "page", params] as const,
		queryFn: () => getChallengesPageFn({ data: params }),
		staleTime: 30_000,
	});
