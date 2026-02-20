import { queryOptions } from "@tanstack/react-query";
import { type Challenge, getChallengesFn } from "./challenges.functions";

export type { Challenge };

export const challengesQueryOptions = queryOptions({
	queryKey: ["challenges"] as const,
	queryFn: () => getChallengesFn(),
});
