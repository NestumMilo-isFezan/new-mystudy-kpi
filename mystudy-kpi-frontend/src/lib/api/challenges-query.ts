import { queryOptions } from "@tanstack/react-query";
import { getChallengesFn } from "./challenges.functions";

export const challengesQueryOptions = queryOptions({
	queryKey: ["challenges"],
	queryFn: () => getChallengesFn(),
});
