import { createFileRoute } from "@tanstack/react-router";
import { KpiReportDownloadAction } from "@/components/pages/manage-kpi-target/kpi-report-download-action";
import { KpiTargetReport } from "@/components/pages/manage-kpi-target/kpi-target-report";
import { adminStudentKpiTargetQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute(
	"/_auth/_staff/staff/students/$id/kpi-target",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			adminStudentKpiTargetQueryOptions(params.id),
		),
	component: AdminStudentKpiTargetPage,
});

function AdminStudentKpiTargetPage() {
	const { id } = Route.useParams();
	const queryOptions = adminStudentKpiTargetQueryOptions(id);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-end gap-2">
				<KpiReportDownloadAction queryOptions={queryOptions} size="sm" />
			</div>

			<KpiTargetReport queryOptions={queryOptions} />
		</div>
	);
}
