import { BarChart3, Sparkles } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { kpiAnalyticsChartConfig } from "@/components/pages/manage-kpi-records/kpi-analytics-config";
import type { KpiAnalyticsChartDatum } from "@/components/pages/manage-kpi-records/kpi-analytics-types";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

type KpiAnalyticsDistributionSectionProps = {
	chartData: KpiAnalyticsChartDatum[];
	totalRecords: number;
};

function getYAxisMax(maxValue: number) {
	if (maxValue <= 1) {
		return 5;
	}

	if (maxValue <= 5) {
		return 15;
	}

	if (maxValue <= 15) {
		return 50;
	}

	if (maxValue <= 30) {
		return 100;
	}

	return Math.ceil((maxValue * 3) / 50) * 50;
}

function getYAxisStep(yAxisMax: number) {
	if (yAxisMax <= 5) {
		return 1;
	}

	if (yAxisMax <= 15) {
		return 3;
	}

	if (yAxisMax <= 50) {
		return 10;
	}

	if (yAxisMax <= 100) {
		return 20;
	}

	return 50;
}

function buildIntegerTicks(yAxisMax: number, step: number) {
	const ticks: number[] = [];

	for (let value = 0; value <= yAxisMax; value += step) {
		ticks.push(value);
	}

	if (ticks[ticks.length - 1] !== yAxisMax) {
		ticks.push(yAxisMax);
	}

	return ticks;
}

export function KpiAnalyticsDistributionSection({
	chartData,
	totalRecords,
}: KpiAnalyticsDistributionSectionProps) {
	const isEmpty = totalRecords === 0;
	const maxCount = Math.max(
		1,
		...chartData.map((item) =>
			Math.max(item.activity, item.competition, item.certification),
		),
	);
	const yAxisMax = getYAxisMax(maxCount);
	const yAxisStep = getYAxisStep(yAxisMax);
	const yAxisTicks = buildIntegerTicks(yAxisMax, yAxisStep);

	return (
		<section className="space-y-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold tracking-tight">
						Distribution by Semester
					</h2>
					<p className="text-muted-foreground text-sm">
						Track how your achievements build up each semester.
					</p>
				</div>
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<span className="rounded-md border px-2 py-1">
						Semesters {chartData.length}
					</span>
					<span className="rounded-md border px-2 py-1">
						Total {totalRecords}
					</span>
				</div>
			</div>

			<div className="border-border/60 overflow-hidden rounded-2xl border bg-background shadow-sm">
				<div className="from-primary/8 to-primary/0 border-border/40 border-b bg-gradient-to-r px-5 py-4">
					<div className="flex items-center gap-3">
						<div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
							<BarChart3 className="size-4" />
						</div>
						<div>
							<h3 className="text-base font-semibold">
								Achievement Distribution
							</h3>
							<p className="text-muted-foreground text-sm">
								Grouped bars compare categories across semesters.
							</p>
						</div>
					</div>
				</div>
				<div className="p-5">
					{isEmpty ? (
						<div className="bg-muted/20 border-border/60 flex h-[340px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 text-center md:h-[420px]">
							<div className="bg-muted flex size-11 items-center justify-center rounded-full">
								<Sparkles className="text-muted-foreground size-5" />
							</div>
							<p className="text-base font-semibold">No KPI records yet</p>
							<p className="text-muted-foreground max-w-md text-sm">
								Add activities, competitions, or certifications to unlock your
								semester trend chart.
							</p>
						</div>
					) : (
						<div className="bg-muted/20 border-border/40 rounded-xl border p-3 md:p-4">
							<ChartContainer
								config={kpiAnalyticsChartConfig}
								className="h-[320px] w-full md:h-[410px]"
							>
								<BarChart data={chartData} barCategoryGap={24} barGap={6}>
									<CartesianGrid vertical={false} strokeDasharray="4 4" />
									<XAxis
										dataKey="name"
										tickLine={false}
										tickMargin={10}
										axisLine={false}
									/>
									<YAxis
										domain={[0, yAxisMax]}
										ticks={yAxisTicks}
										allowDecimals={false}
										tickLine={false}
										axisLine={false}
										tickMargin={10}
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Legend />
									<Bar
										dataKey="activity"
										fill="var(--color-activity)"
										barSize={28}
										radius={0}
									/>
									<Bar
										dataKey="competition"
										fill="var(--color-competition)"
										barSize={28}
										radius={0}
									/>
									<Bar
										dataKey="certification"
										fill="var(--color-certification)"
										barSize={28}
										radius={0}
									/>
								</BarChart>
							</ChartContainer>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
