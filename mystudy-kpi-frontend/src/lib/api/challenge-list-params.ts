import { z } from "zod";

export const SORTABLE_CHALLENGE_COLUMNS = ["semester", "challenge"] as const;

export type SortableChallengeColumn = (typeof SORTABLE_CHALLENGE_COLUMNS)[number];

export const challengeListSearchSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
	sortBy: z.enum(SORTABLE_CHALLENGE_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	semester: z.coerce.number().int().min(1).max(3).optional(),
});

export type ChallengeListSearch = z.infer<typeof challengeListSearchSchema>;

export const challengeListParamsSchema = z.object({
	page: z.number().int().positive(),
	limit: z.number().int().positive().max(100),
	sortBy: z.enum(SORTABLE_CHALLENGE_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	semester: z.number().int().min(1).max(3).optional(),
});

export type ChallengeListParams = z.infer<typeof challengeListParamsSchema>;
