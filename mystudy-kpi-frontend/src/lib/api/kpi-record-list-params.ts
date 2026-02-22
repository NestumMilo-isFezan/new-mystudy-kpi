import { z } from "zod";

export const SORTABLE_KPI_RECORD_COLUMNS = ["semester", "type", "title"] as const;

export type SortableKpiRecordColumn = (typeof SORTABLE_KPI_RECORD_COLUMNS)[number];

export const kpiRecordListSearchSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(25),
	sortBy: z.enum(SORTABLE_KPI_RECORD_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	type: z.enum(["activity", "competition", "certification"]).optional(),
});

export type KpiRecordListSearch = z.infer<typeof kpiRecordListSearchSchema>;

export const kpiRecordListParamsSchema = z.object({
	page: z.number().int().positive(),
	limit: z.number().int().positive().max(100),
	sortBy: z.enum(SORTABLE_KPI_RECORD_COLUMNS).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	type: z.enum(["activity", "competition", "certification"]).optional(),
});

export type KpiRecordListParams = z.infer<typeof kpiRecordListParamsSchema>;
