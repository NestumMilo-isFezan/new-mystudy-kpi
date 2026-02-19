import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ManageMentorship } from "@/components/pages/mentorship/manage-student/manage-mentorship";
import { MentorshipTableSkeleton } from "@/components/pages/mentorship/mentorship-table-skeleton";
import { mentorshipByIdQueryOptions } from "@/lib/api/mentorships-query";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/$mentorshipId",
)({
	loader: ({ params, context }) =>
		context.queryClient.ensureQueryData(
			mentorshipByIdQueryOptions(Number(params.mentorshipId)),
		),
	component: ManageMentorshipRoute,
});

function ManageMentorshipRoute() {
	const { mentorshipId } = Route.useParams();

	return (
		<Suspense fallback={<MentorshipTableSkeleton />}>
			<ManageMentorship mentorshipId={Number(mentorshipId)} />
		</Suspense>
	);
}
