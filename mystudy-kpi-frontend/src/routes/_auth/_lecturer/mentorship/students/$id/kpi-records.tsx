import { createFileRoute } from "@tanstack/react-router";
import { KpiRecordsTable } from "@/components/pages/manage-kpi-records/kpi-records-table";
import { LecturerKpiRecordActionGroup } from "@/components/pages/manage-kpi-records/lecturer-action-group";
import { mentorshipStudentKpiRecordsQueryOptions } from "@/lib/api/mentorship-students-query";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/students/$id/kpi-records",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			mentorshipStudentKpiRecordsQueryOptions(params.id),
		),
	component: StudentKpiRecordsPage,
});

function StudentKpiRecordsPage() {
	const { id } = Route.useParams();

	return (
		<div className="space-y-6">
			<KpiRecordsTable
				ActionGroup={LecturerKpiRecordActionGroup}
				queryOptions={mentorshipStudentKpiRecordsQueryOptions(id)}
				isLecturerMentee={true}
			/>
		</div>
	);
}
