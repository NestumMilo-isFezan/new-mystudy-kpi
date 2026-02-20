import { createFileRoute } from "@tanstack/react-router";
import { ChallengeTable } from "@/components/pages/manage-challenges/challenge-table";
import { LecturerChallengeActionGroup } from "@/components/pages/manage-challenges/lecturer-action-group";
import { mentorshipStudentChallengesQueryOptions } from "@/lib/api/mentorship-students-query";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/students/$id/challenges",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			mentorshipStudentChallengesQueryOptions(params.id),
		),
	component: StudentChallengesPage,
});

function StudentChallengesPage() {
	const { id } = Route.useParams();

	return (
		<div className="space-y-6">
			<ChallengeTable
				ActionGroup={LecturerChallengeActionGroup}
				queryOptions={mentorshipStudentChallengesQueryOptions(id)}
			/>
		</div>
	);
}
