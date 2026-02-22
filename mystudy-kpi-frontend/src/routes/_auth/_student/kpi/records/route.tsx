import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
	useSearch,
} from "@tanstack/react-router";
import { KpiRecordsHeader } from "@/components/pages/manage-kpi-records/kpi-records-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { academicsQueryOptions } from "@/lib/api/academics-query";
import { kpiRecordListSearchSchema } from "@/lib/api/kpi-record-list-params";
import { kpiRecordsPageQueryOptions } from "@/lib/api/kpi-records-query";

export const Route = createFileRoute("/_auth/_student/kpi/records")({
	validateSearch: (search) => kpiRecordListSearchSchema.parse(search),
	loader: async ({ context, location }) => {
		const search = kpiRecordListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		await Promise.all([
			context.queryClient.ensureQueryData(kpiRecordsPageQueryOptions(search)),
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
							render={<Link to="." search={(prev) => ({ ...prev, page: 1, type: undefined })} />}
						>
							All Records
						</TabsTrigger>
						<TabsTrigger
							value="activity"
							render={<Link to="." search={(prev) => ({ ...prev, page: 1, type: "activity" })} />}
						>
							Activities
						</TabsTrigger>
						<TabsTrigger
							value="competition"
							render={<Link to="." search={(prev) => ({ ...prev, page: 1, type: "competition" })} />}
						>
							Competitions
						</TabsTrigger>
						<TabsTrigger
							value="certification"
							render={<Link to="." search={(prev) => ({ ...prev, page: 1, type: "certification" })} />}
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
