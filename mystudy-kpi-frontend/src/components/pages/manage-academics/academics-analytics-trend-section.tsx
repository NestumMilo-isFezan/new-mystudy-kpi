import { ChartLine, Sparkles } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { academicsAnalyticsChartConfig } from "@/components/pages/manage-academics/academics-analytics-config";
import type { AcademicChartDatum } from "@/components/pages/manage-academics/academics-analytics-types";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

type AcademicsAnalyticsTrendSectionProps = {
	chartData: AcademicChartDatum[];
};

export function AcademicsAnalyticsTrendSection({
	chartData,
}: AcademicsAnalyticsTrendSectionProps) {
	const isEmpty = chartData.length === 0;
	const lineData = isEmpty
		? []
		: [{ ...chartData[0], name: "Start", gpa: 0 }, ...chartData];

	return (
		<section className="space-y-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold tracking-tight">GPA Trend</h2>
					<p className="text-muted-foreground text-sm">
						How your GPA shifts from one semester to the next.
					</p>
				</div>
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<span className="rounded-md border px-2 py-1">
						Semesters {chartData.length}
					</span>
				</div>
			</div>

			<div className="border-border/60 overflow-hidden rounded-2xl border bg-background shadow-sm">
				<div className="from-primary/8 to-primary/0 border-border/40 border-b bg-gradient-to-r px-5 py-4">
					<div className="flex items-center gap-3">
						<div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
							<ChartLine className="size-4" />
						</div>
						<div>
							<h3 className="text-base font-semibold">Semester GPA Chart</h3>
							<p className="text-muted-foreground text-sm">
								Line graph from 0.00 across all recorded semesters.
							</p>
						</div>
					</div>
				</div>

				<div className="p-5">
					{isEmpty ? (
						<div className="bg-muted/20 border-border/60 flex h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 text-center md:h-[400px]">
							<div className="bg-muted flex size-11 items-center justify-center rounded-full">
								<Sparkles className="text-muted-foreground size-5" />
							</div>
							<p className="text-base font-semibold">No academic records yet</p>
							<p className="text-muted-foreground max-w-md text-sm">
								Add semester GPA entries to visualize your academic trend.
							</p>
						</div>
					) : (
						<div className="bg-muted/20 border-border/40 rounded-xl border p-3 md:p-4">
							<ChartContainer
								config={academicsAnalyticsChartConfig}
								className="h-[320px] w-full md:h-[400px]"
							>
								<LineChart
									data={lineData}
									margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
								>
									<CartesianGrid vertical={false} strokeDasharray="4 4" />
									<XAxis
										dataKey="name"
										tickFormatter={(value) => (value === "Start" ? "0" : value)}
										tickLine={false}
										tickMargin={10}
										axisLine={false}
									/>
									<YAxis
										domain={[0, 4]}
										ticks={[0, 1, 2, 3, 4]}
										allowDecimals={false}
										tickLine={false}
										axisLine={false}
										tickMargin={10}
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Line
										dataKey="gpa"
										type="monotone"
										stroke="var(--color-gpa)"
										strokeWidth={3}
										dot={{
											r: 4,
											strokeWidth: 2,
											fill: "hsl(var(--background))",
										}}
										activeDot={{ r: 6 }}
									/>
								</LineChart>
							</ChartContainer>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
