import { createFileRoute } from "@tanstack/react-router";
import { AcademicsTable } from "@/components/pages/manage-academics/academics-table";
import type { AcademicRecord } from "@/lib/api/academics.functions";
import { adminStudentAcademicsQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute(
	"/_auth/_staff/staff/mentorships/students/$id/academics",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			adminStudentAcademicsQueryOptions(params.id),
		),
	component: AdminMentorshipStudentAcademicsPage,
});

type ActionGroupProps = {
	record: AcademicRecord;
	variant: "card" | "cell";
};

function StaffAcademicActionGroup(_props: ActionGroupProps) {
	return null;
}

function AdminMentorshipStudentAcademicsPage() {
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
