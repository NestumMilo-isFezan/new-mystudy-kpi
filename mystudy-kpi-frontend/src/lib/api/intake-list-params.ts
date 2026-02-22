import { z } from "zod";

export const SORTABLE_INTAKE_COLUMNS = ["name", "startYear", "isActive"] as const;

export type SortableIntakeColumn = (typeof SORTABLE_INTAKE_COLUMNS)[number];

export const intakeListSearchSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
	sortBy: z.enum(SORTABLE_INTAKE_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	status: z.enum(["active", "inactive"]).optional(),
});

export type IntakeListSearch = z.infer<typeof intakeListSearchSchema>;

export const intakeListParamsSchema = z.object({
	page: z.number().int().positive(),
	limit: z.number().int().positive().max(100),
	sortBy: z.enum(SORTABLE_INTAKE_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	status: z.enum(["active", "inactive"]).optional(),
});

export type IntakeListParams = z.infer<typeof intakeListParamsSchema>;
