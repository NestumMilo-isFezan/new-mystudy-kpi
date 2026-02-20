import { createFileRoute } from "@tanstack/react-router";
import { AcademicsTable } from "@/components/pages/manage-academics/academics-table";
import { LecturerAcademicActionGroup } from "@/components/pages/manage-academics/lecturer-action-group";
import { mentorshipStudentAcademicsQueryOptions } from "@/lib/api/mentorship-students-query";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/students/$id/academics",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			mentorshipStudentAcademicsQueryOptions(params.id),
		),
	component: StudentAcademicsPage,
});

function StudentAcademicsPage() {
	const { id } = Route.useParams();

	return (
		<div className="space-y-6">
			<AcademicsTable
				ActionGroup={LecturerAcademicActionGroup}
				queryOptions={mentorshipStudentAcademicsQueryOptions(id)}
			/>
		</div>
	);
}
