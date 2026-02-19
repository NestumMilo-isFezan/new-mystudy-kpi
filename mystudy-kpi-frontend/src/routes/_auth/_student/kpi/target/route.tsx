import { createFileRoute, Outlet } from "@tanstack/react-router";
import { KpiTargetHeader } from "@/components/pages/manage-kpi-target/kpi-target-header";
import { kpiAimQueryOptions } from "@/lib/api/kpi-aim-query";

export const Route = createFileRoute("/_auth/_student/kpi/target")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(kpiAimQueryOptions);
	},
	component: KpiTargetLayout,
});

function KpiTargetLayout() {
	return (
		<div className="flex flex-col gap-8 py-6 text-foreground">
			<KpiTargetHeader />
			<Outlet />
		</div>
	);
}
