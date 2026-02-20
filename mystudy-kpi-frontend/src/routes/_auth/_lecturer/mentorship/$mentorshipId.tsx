import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { ManageMentorship } from "@/components/pages/mentorship/manage-student/manage-mentorship";
import { MentorshipTableSkeleton } from "@/components/pages/mentorship/mentorship-table-skeleton";
import { mentorshipByIdQueryOptions } from "@/lib/api/mentorships-query";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/$mentorshipId",
)({
	loader: async ({ params, context }) => {
		try {
			return await context.queryClient.ensureQueryData(
				mentorshipByIdQueryOptions(Number(params.mentorshipId)),
			);
		} catch (error) {
			if (error instanceof Error && error.message.includes("404 Not Found")) {
				throw redirect({ to: "/mentorship" });
			}
			throw error;
		}
	},
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
