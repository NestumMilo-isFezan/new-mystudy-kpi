import { z } from "zod";

/**
 * Allowlist of sortable column IDs that map to backend SortableUserColumn enum cases.
 * Matches the `fromRequest` mapping in SortableUserColumn.php.
 */
export const SORTABLE_USER_COLUMNS = [
	"identifier",
	"firstName",
	"lastName",
	"email",
	"startYear",
] as const;

export type SortableUserColumn = (typeof SORTABLE_USER_COLUMNS)[number];

export const paginatedListSearchSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
	sortBy: z.enum(SORTABLE_USER_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	startYear: z.coerce.number().int().positive().optional(),
});

export type PaginatedListSearch = z.infer<typeof paginatedListSearchSchema>;

/**
 * Shared Zod schema for server function list params (students + lecturers).
 * Used for `.inputValidator()` on createServerFn.
 */
export const listParamsSchema = z.object({
	page: z.number().int().positive(),
	limit: z.number().int().positive().max(100),
	sortBy: z.enum(SORTABLE_USER_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	startYear: z.number().int().positive().optional(),
});

export type ListParams = z.infer<typeof listParamsSchema>;
