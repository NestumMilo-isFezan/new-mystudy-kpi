import { z } from "zod";

export const SORTABLE_MENTORSHIP_COLUMNS = [
	"intakeBatchName",
	"startYear",
	"menteeCount",
	"lecturer",
] as const;

export type SortableMentorshipColumn = (typeof SORTABLE_MENTORSHIP_COLUMNS)[number];

export const mentorshipListSearchSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
	sortBy: z.enum(SORTABLE_MENTORSHIP_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	startYear: z.coerce.number().int().positive().optional(),
	lecturerId: z.string().uuid().optional(),
});

export type MentorshipListSearch = z.infer<typeof mentorshipListSearchSchema>;

export const mentorshipListParamsSchema = z.object({
	page: z.number().int().positive(),
	limit: z.number().int().positive().max(100),
	sortBy: z.enum(SORTABLE_MENTORSHIP_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	startYear: z.number().int().positive().optional(),
	lecturerId: z.string().uuid().optional(),
});

export type MentorshipListParams = z.infer<typeof mentorshipListParamsSchema>;
