import { createFileRoute, Outlet } from "@tanstack/react-router";
import { StudentKpiHeader } from "@/components/pages/manage-student/student-kpi-header";
import { adminStudentOverviewQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute("/_auth/_staff/staff/students/$id")({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			adminStudentOverviewQueryOptions(params.id),
		),
	component: () => <AdminStudentLayout />,
});

function AdminStudentLayout() {
	const { id } = Route.useParams();

	return (
		<div className="space-y-6">
			<StudentKpiHeader
				overviewQueryOptions={adminStudentOverviewQueryOptions(id)}
				rootPath="/staff/students"
				backPath="/staff/students"
				backLabel="Back to Students"
			/>
			<Outlet />
		</div>
	);
}
