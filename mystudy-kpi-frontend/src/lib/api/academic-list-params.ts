import { z } from "zod";

export const SORTABLE_ACADEMIC_COLUMNS = [
	"academicYear",
	"semester",
	"gpa",
] as const;

export type SortableAcademicColumn = (typeof SORTABLE_ACADEMIC_COLUMNS)[number];

export const academicListSearchSchema = z.object({
	sortBy: z.enum(SORTABLE_ACADEMIC_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	semester: z.coerce.number().int().min(1).max(3).optional(),
});

export type AcademicListSearch = z.infer<typeof academicListSearchSchema>;

export const academicListParamsSchema = z.object({
	sortBy: z.enum(SORTABLE_ACADEMIC_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	semester: z.number().int().min(1).max(3).optional(),
});

export type AcademicListParams = z.infer<typeof academicListParamsSchema>;
