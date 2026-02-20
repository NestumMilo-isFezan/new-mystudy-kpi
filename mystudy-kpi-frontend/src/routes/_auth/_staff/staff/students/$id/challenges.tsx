import { createFileRoute } from "@tanstack/react-router";
import { ChallengeTable } from "@/components/pages/manage-challenges/challenge-table";
import type { Challenge } from "@/lib/api/challenges.functions";
import { adminStudentChallengesQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute(
	"/_auth/_staff/staff/students/$id/challenges",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			adminStudentChallengesQueryOptions(params.id),
		),
	component: AdminStudentChallengesPage,
});

type ActionGroupProps = {
	record: Challenge;
	variant: "card" | "cell";
};

function StaffChallengeActionGroup(_props: ActionGroupProps) {
	return null;
}

function AdminStudentChallengesPage() {
	const { id } = Route.useParams();

	return (
		<div className="space-y-6">
			<ChallengeTable
				ActionGroup={StaffChallengeActionGroup}
				queryOptions={adminStudentChallengesQueryOptions(id)}
			/>
		</div>
	);
}
