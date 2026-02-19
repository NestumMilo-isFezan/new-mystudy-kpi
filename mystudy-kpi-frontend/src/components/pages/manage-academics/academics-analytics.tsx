import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { AcademicsAnalyticsOverviewSection } from "@/components/pages/manage-academics/academics-analytics-overview-section";
import { AcademicsAnalyticsTrendSection } from "@/components/pages/manage-academics/academics-analytics-trend-section";
import {
	buildAcademicChartData,
	buildAcademicSnapshot,
} from "@/components/pages/manage-academics/academics-analytics-utils";
import { academicsQueryOptions } from "@/lib/api/academics-query";

export function AcademicsAnalytics() {
	const { data: records = [] } = useSuspenseQuery(academicsQueryOptions);
	const snapshot = useMemo(() => buildAcademicSnapshot(records), [records]);
	const chartData = useMemo(() => buildAcademicChartData(records), [records]);

	return (
		<div className="flex flex-col gap-8">
			<AcademicsAnalyticsOverviewSection snapshot={snapshot} />
			<AcademicsAnalyticsTrendSection chartData={chartData} />
		</div>
	);
}
