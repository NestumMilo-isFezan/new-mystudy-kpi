import type { KpiRecord } from "@/lib/api/kpi-records.functions";

export type KpiStatKey = KpiRecord["type"];

export type KpiAnalyticsStats = Record<KpiStatKey, number>;

export type KpiAnalyticsChartDatum = {
	name: string;
	activity: number;
	competition: number;
	certification: number;
};
