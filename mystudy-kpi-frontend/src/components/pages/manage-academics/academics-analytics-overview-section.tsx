import { Calendar, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import type { AcademicSnapshot } from "@/components/pages/manage-academics/academics-analytics-types";
import { cn } from "@/lib/utils";

type AcademicsAnalyticsOverviewSectionProps = {
	snapshot: AcademicSnapshot;
};

const metricTheme = {
	latest: {
		icon: GraduationCap,
		barTone: "bg-blue-500/75",
	},
	average: {
		icon: TrendingUp,
		barTone: "bg-violet-500/75",
	},
	semesters: {
		icon: Calendar,
		barTone: "bg-emerald-500/75",
	},
} as const;

const GPA_MAX = 4;

export function AcademicsAnalyticsOverviewSection({
	snapshot,
}: AcademicsAnalyticsOverviewSectionProps) {
	const latestRatio = Math.round((snapshot.latestGpa / GPA_MAX) * 100);
	const averageRatio = Math.round((snapshot.averageGpa / GPA_MAX) * 100);
	const semesterRatio = Math.min(snapshot.totalSemesters * 10, 100);

	const metrics = [
		{
			key: "latest",
			label: "Latest GPA",
			value: snapshot.latestGpa.toFixed(2),
			description: snapshot.latestTerm
				? `Most recent term: ${snapshot.latestTerm}`
				: "No records yet",
			ratio: latestRatio,
			theme: metricTheme.latest,
			isStrong: snapshot.latestGpa >= 3.5,
		},
		{
			key: "average",
			label: "Average GPA",
			value: snapshot.averageGpa.toFixed(2),
			description: "Across all recorded terms",
			ratio: averageRatio,
			theme: metricTheme.average,
		},
		{
			key: "semesters",
			label: "Total Semesters",
			value: snapshot.totalSemesters.toString(),
			description: `Top GPA: ${snapshot.topGpa.toFixed(2)}`,
			ratio: semesterRatio,
			theme: metricTheme.semesters,
		},
	] as const;

	return (
		<section className="space-y-5">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold tracking-tight">
						Academic Snapshot
					</h2>
					<p className="text-muted-foreground text-sm">
						A quick pulse check of your GPA performance.
					</p>
				</div>
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<span className="rounded-md border px-2 py-1">
						Records {snapshot.totalSemesters}
					</span>
					<span className="rounded-md border px-2 py-1">
						Peak {snapshot.topGpa.toFixed(2)}
					</span>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{metrics.map((metric) => (
					<SummaryCard
						key={metric.key}
						title={
							<div className="flex items-center gap-2">
								<span>{metric.label}</span>
								{metric.key === "latest" && metric.isStrong && (
									<span className="text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
										<Sparkles className="size-2.5" />
										Strong
									</span>
								)}
							</div>
						}
						value={metric.value}
						description={metric.description}
						icon={metric.theme.icon}
					>
						<div className="bg-muted mt-4 h-1.5 overflow-hidden rounded-full">
							<div
								className={cn(
									"h-full rounded-full transition-all duration-500",
									metric.theme.barTone,
								)}
								style={{ width: `${metric.ratio}%` }}
							/>
						</div>
					</SummaryCard>
				))}
			</div>
		</section>
	);
}
