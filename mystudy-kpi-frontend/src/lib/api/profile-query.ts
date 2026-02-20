import { queryOptions } from "@tanstack/react-query";
import { getProfileFn } from "./profile.functions";

export const profileQueryOptions = queryOptions({
	queryKey: ["profile"] as const,
	queryFn: () => getProfileFn(),
});
