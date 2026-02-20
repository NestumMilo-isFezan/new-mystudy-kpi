import { createFileRoute } from "@tanstack/react-router";
import { AcademicsTable } from "@/components/pages/manage-academics/academics-table";
import type { AcademicRecord } from "@/lib/api/academics.functions";
import { adminStudentAcademicsQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute(
	"/_auth/_staff/staff/students/$id/academics",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			adminStudentAcademicsQueryOptions(params.id),
		),
	component: AdminStudentAcademicsPage,
});

type ActionGroupProps = {
	record: AcademicRecord;
	variant: "card" | "cell";
};

/**
 * Empty action group for staff.
 * Staff can view but not edit individual student GPA records from this view.
 */
function StaffAcademicActionGroup(_props: ActionGroupProps) {
	return null;
}

function AdminStudentAcademicsPage() {
	const { id } = Route.useParams();

	return (
		<div className="space-y-6">
			<AcademicsTable
				ActionGroup={StaffAcademicActionGroup}
				queryOptions={adminStudentAcademicsQueryOptions(id)}
			/>
		</div>
	);
}
