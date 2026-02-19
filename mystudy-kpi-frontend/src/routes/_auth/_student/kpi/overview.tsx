import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { Suspense } from "react";
import { OverviewComparisonChart } from "@/components/pages/overview/overview-comparison-chart";
import { OverviewQuickActions } from "@/components/pages/overview/overview-quick-actions";
import { OverviewSummaryCards } from "@/components/pages/overview/overview-summary-cards";
import { Heading } from "@/components/ui/heading";
import { kpiSummaryQueryOptions } from "@/lib/api/kpi-summary-query";

export const Route = createFileRoute("/_auth/_student/kpi/overview")({
	component: KpiOverviewPage,
});

function KpiOverviewPage() {
	return (
		<div className="flex flex-col gap-8 w-full max-w-full overflow-hidden py-6">
			<Heading
				title="Student Dashboard"
				description="Welcome back! Here's an overview of your academic and KPI progress."
				icon={LayoutDashboard}
			/>

			<Suspense fallback={<DashboardSkeleton />}>
				<DashboardContent />
			</Suspense>
		</div>
	);
}

function DashboardContent() {
	const { data: summary } = useSuspenseQuery(kpiSummaryQueryOptions);

	return (
		<div className="flex flex-col gap-8 w-full min-w-0">
			<OverviewSummaryCards summary={summary} />

			<div className="grid gap-8 lg:grid-cols-3 w-full min-w-0">
				<div className="lg:col-span-2 min-w-0">
					<OverviewComparisonChart summary={summary} />
				</div>
				<div className="min-w-0">
					<OverviewQuickActions />
				</div>
			</div>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className="flex flex-col gap-8 animate-pulse">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="h-32 rounded-xl bg-muted" />
				))}
			</div>
			<div className="grid gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2 h-[450px] rounded-xl bg-muted" />
				<div className="h-[250px] rounded-xl bg-muted" />
			</div>
		</div>
	);
}
