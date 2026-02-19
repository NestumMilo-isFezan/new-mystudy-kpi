import type {
	KpiAnalyticsChartDatum,
	KpiAnalyticsStats,
	KpiStatKey,
} from "@/components/pages/manage-kpi-records/kpi-analytics-types";
import type { KpiRecord } from "@/lib/api/kpi-records.functions";

export function buildKpiAnalyticsStats(
	records: KpiRecord[],
): KpiAnalyticsStats {
	return records.reduce<KpiAnalyticsStats>(
		(acc, record) => {
			acc[record.type] += 1;
			return acc;
		},
		{
			activity: 0,
			competition: 0,
			certification: 0,
		},
	);
}

export function buildKpiAnalyticsChartData(
	records: KpiRecord[],
): KpiAnalyticsChartDatum[] {
	const grouped = records.reduce<
		Record<
			string,
			KpiAnalyticsChartDatum & { academicYear: number; semester: number }
		>
	>((acc, record) => {
		const term = record.semester.termString;

		if (!acc[term]) {
			acc[term] = {
				name: term,
				activity: 0,
				competition: 0,
				certification: 0,
				academicYear: record.semester.academicYear,
				semester: record.semester.semester,
			};
		}

		acc[term][record.type] += 1;
		return acc;
	}, {});

	return Object.values(grouped)
		.sort((a, b) => {
			if (a.academicYear !== b.academicYear) {
				return a.academicYear - b.academicYear;
			}
			return a.semester - b.semester;
		})
		.map(({ name, activity, competition, certification }) => ({
			name,
			activity,
			competition,
			certification,
		}));
}

export function getTotalRecords(stats: KpiAnalyticsStats) {
	return stats.activity + stats.competition + stats.certification;
}

export function getTopKpiCategory(stats: KpiAnalyticsStats): KpiStatKey {
	return (Object.keys(stats) as KpiStatKey[]).reduce((currentTop, key) => {
		if (stats[key] > stats[currentTop]) {
			return key;
		}
		return currentTop;
	}, "activity");
}
