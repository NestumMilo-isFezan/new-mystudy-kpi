import { Activity, Award, Star, Trophy } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { kpiAnalyticsChartConfig } from "@/components/pages/manage-kpi-records/kpi-analytics-config";
import type {
	KpiAnalyticsStats,
	KpiStatKey,
} from "@/components/pages/manage-kpi-records/kpi-analytics-types";
import { cn } from "@/lib/utils";

type KpiAnalyticsOverviewSectionProps = {
	stats: KpiAnalyticsStats;
	totalRecords: number;
	topCategory: KpiStatKey;
};

const cardTheme = {
	activity: {
		icon: Activity,
		barTone: "bg-emerald-500/75",
	},
	competition: {
		icon: Trophy,
		barTone: "bg-amber-500/75",
	},
	certification: {
		icon: Award,
		barTone: "bg-cyan-500/75",
	},
} as const;

export function KpiAnalyticsOverviewSection({
	stats,
	totalRecords,
	topCategory,
}: KpiAnalyticsOverviewSectionProps) {
	const metricKeys: KpiStatKey[] = ["activity", "competition", "certification"];

	return (
		<section className="space-y-5">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold tracking-tight">
						Achievement Overview
					</h2>
					<p className="text-muted-foreground text-sm">
						Your KPI records at a glance across all categories
					</p>
				</div>
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<span className="rounded-md border px-2 py-1">
						Total {totalRecords}
					</span>
					<span className="rounded-md border px-2 py-1">
						Top {kpiAnalyticsChartConfig[topCategory].label}
					</span>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{metricKeys.map((type) => {
					const metricValue = stats[type];
					const metricShare = totalRecords
						? Math.round((metricValue / totalRecords) * 100)
						: 0;
					const theme = cardTheme[type];
					const isTopCategory = type === topCategory && metricValue > 0;

					return (
						<SummaryCard
							key={type}
							title={
								<div className="flex items-center gap-2">
									<span>{kpiAnalyticsChartConfig[type].label}</span>
									{isTopCategory && (
										<span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
											<Star className="size-2.5" />
											Leading
										</span>
									)}
								</div>
							}
							value={metricValue}
							description={`${metricShare}% of total records`}
							icon={theme.icon}
							className={cn(isTopCategory && "ring-primary/25 ring-2")}
						>
							<div className="bg-muted mt-4 h-1.5 overflow-hidden rounded-full">
								<div
									className={cn(
										"h-full rounded-full transition-all duration-500",
										theme.barTone,
									)}
									style={{ width: `${metricShare}%` }}
								/>
							</div>
						</SummaryCard>
					);
				})}
			</div>
		</section>
	);
}
