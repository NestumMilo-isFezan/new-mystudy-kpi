import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { StudentKpiHeader } from "@/components/pages/manage-student/student-kpi-header";
import { mentorshipStudentOverviewQueryOptions } from "@/lib/api/mentorship-students-query";
import { lecturerMentorshipsQueryOptions } from "@/lib/api/mentorships-query";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/students/$id",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			mentorshipStudentOverviewQueryOptions(params.id),
		),
	component: () => <LecturerStudentLayout />,
});

function LecturerStudentLayout() {
	const { id } = Route.useParams();
	const { data: mentorships } = useSuspenseQuery(
		lecturerMentorshipsQueryOptions,
	);

	const mentorshipId = mentorships.find((m) =>
		m.mentees.some((s) => s.id === id),
	)?.id;
	const backPath = mentorshipId ? `/mentorship/${mentorshipId}` : "/mentorship";

	return (
		<div className="space-y-6">
			<StudentKpiHeader
				overviewQueryOptions={mentorshipStudentOverviewQueryOptions(id)}
				rootPath="/mentorship/students"
				backPath={backPath}
				backLabel="Back to Mentorship"
			/>
			<Outlet />
		</div>
	);
}
