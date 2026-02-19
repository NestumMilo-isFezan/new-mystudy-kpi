import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
	useSearch,
} from "@tanstack/react-router";
import { z } from "zod";
import { KpiRecordsHeader } from "@/components/pages/manage-kpi-records/kpi-records-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { academicsQueryOptions } from "@/lib/api/academics-query";
import { kpiRecordsQueryOptions } from "@/lib/api/kpi-records-query";

const recordsSearchSchema = z.object({
	type: z.enum(["all", "activity", "competition", "certification"]).optional(),
});

export const Route = createFileRoute("/_auth/_student/kpi/records")({
	validateSearch: (search) => recordsSearchSchema.parse(search),
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(kpiRecordsQueryOptions),
			context.queryClient.ensureQueryData(academicsQueryOptions),
		]);
	},
	component: KpiRecordsLayout,
});

function KpiRecordsLayout() {
	const location = useLocation();
	const { type } = useSearch({ from: "/_auth/_student/kpi/records" });
	const selectedType = type ?? "all";
	const isAnalytics = location.pathname.endsWith("/analytics");

	return (
		<div className="flex flex-col gap-8 py-6 text-foreground">
			<KpiRecordsHeader />

			{!isAnalytics && (
				<Tabs value={selectedType} className="w-full">
					<TabsList>
						<TabsTrigger
							value="all"
							render={<Link to="." search={{ type: "all" }} />}
						>
							All Records
						</TabsTrigger>
						<TabsTrigger
							value="activity"
							render={<Link to="." search={{ type: "activity" }} />}
						>
							Activities
						</TabsTrigger>
						<TabsTrigger
							value="competition"
							render={<Link to="." search={{ type: "competition" }} />}
						>
							Competitions
						</TabsTrigger>
						<TabsTrigger
							value="certification"
							render={<Link to="." search={{ type: "certification" }} />}
						>
							Certifications
						</TabsTrigger>
					</TabsList>
				</Tabs>
			)}

			<Outlet />
		</div>
	);
}
