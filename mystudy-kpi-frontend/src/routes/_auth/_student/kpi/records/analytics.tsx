import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { KpiAnalyticsDistributionSection } from "@/components/pages/manage-kpi-records/kpi-analytics-distribution-section";
import { KpiAnalyticsOverviewSection } from "@/components/pages/manage-kpi-records/kpi-analytics-overview-section";
import {
	buildKpiAnalyticsChartData,
	buildKpiAnalyticsStats,
	getTopKpiCategory,
	getTotalRecords,
} from "@/components/pages/manage-kpi-records/kpi-analytics-utils";
import { kpiRecordsQueryOptions } from "@/lib/api/kpi-records-query";

export const Route = createFileRoute("/_auth/_student/kpi/records/analytics")({
	component: KpiAnalyticsPage,
});

function KpiAnalyticsPage() {
	const { data: records = [] } = useSuspenseQuery(kpiRecordsQueryOptions);

	const stats = useMemo(() => buildKpiAnalyticsStats(records), [records]);
	const chartData = useMemo(
		() => buildKpiAnalyticsChartData(records),
		[records],
	);
	const totalRecords = useMemo(() => getTotalRecords(stats), [stats]);
	const topCategory = useMemo(() => getTopKpiCategory(stats), [stats]);

	return (
		<div className="flex flex-col gap-8">
			<KpiAnalyticsOverviewSection
				stats={stats}
				totalRecords={totalRecords}
				topCategory={topCategory}
			/>
			<KpiAnalyticsDistributionSection
				chartData={chartData}
				totalRecords={totalRecords}
			/>
		</div>
	);
}
