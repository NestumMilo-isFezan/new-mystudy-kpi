import { createFileRoute } from "@tanstack/react-router";
import { KpiRecordsTable } from "@/components/pages/manage-kpi-records/kpi-records-table";
import type { KpiRecord } from "@/lib/api/kpi-records.functions";
import { adminStudentKpiRecordsQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute(
	"/_auth/_staff/staff/students/$id/kpi-records",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			adminStudentKpiRecordsQueryOptions(params.id),
		),
	component: AdminStudentKpiRecordsPage,
});

type ActionGroupProps = {
	record: KpiRecord;
	variant: "card" | "cell";
};

function StaffKpiRecordActionGroup(_props: ActionGroupProps) {
	return null;
}

function AdminStudentKpiRecordsPage() {
	const { id } = Route.useParams();

	return (
		<div className="space-y-6">
			<KpiRecordsTable
				ActionGroup={StaffKpiRecordActionGroup}
				queryOptions={adminStudentKpiRecordsQueryOptions(id)}
				isLecturerMentee={true} // Enable filtering for staff too
			/>
		</div>
	);
}
