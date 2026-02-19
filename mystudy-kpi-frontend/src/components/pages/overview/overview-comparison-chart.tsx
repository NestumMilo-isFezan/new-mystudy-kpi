import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { kpiAnalyticsChartConfig } from "@/components/pages/manage-kpi-records/kpi-analytics-config";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { KpiSummaryResponse } from "@/lib/api/kpi-summary.functions";

const levelLabels: Record<string, string> = {
	faculty: "Faculty",
	university: "University",
	local: "Local",
	national: "National",
	international: "International",
};

export function OverviewComparisonChart({
	summary,
}: {
	summary: KpiSummaryResponse;
}) {
	const chartData = Object.keys(levelLabels).map((key) => ({
		name: levelLabels[key],
		activity:
			summary.actual.activities[key as keyof typeof summary.actual.activities],
		competition:
			summary.actual.competitions[
				key as keyof typeof summary.actual.competitions
			],
	}));

	return (
		<div className="rounded-xl border bg-card p-6 shadow-sm overflow-hidden">
			<div className="flex flex-col gap-1 pb-6">
				<h3 className="text-lg font-semibold">Activity & Competition Level</h3>
				<p className="text-sm text-muted-foreground">
					Achievement distribution across different levels
				</p>
			</div>
			<div className="h-[350px] w-full min-w-0">
				<ChartContainer
					config={kpiAnalyticsChartConfig}
					className="aspect-auto h-full w-full"
				>
					<BarChart
						data={chartData}
						margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
					>
						<CartesianGrid vertical={false} strokeDasharray="4 4" />
						<XAxis
							dataKey="name"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<YAxis tickLine={false} axisLine={false} tickMargin={10} />
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Bar
							dataKey="activity"
							fill="var(--color-activity)"
							radius={[4, 4, 0, 0]}
							name="activity"
						/>
						<Bar
							dataKey="competition"
							fill="var(--color-competition)"
							radius={[4, 4, 0, 0]}
							name="competition"
						/>
					</BarChart>
				</ChartContainer>
			</div>
		</div>
	);
}
