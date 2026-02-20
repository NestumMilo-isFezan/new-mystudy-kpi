import { createFileRoute, redirect } from "@tanstack/react-router";
import { ManageMentorship } from "@/components/pages/mentorship/manage-student/manage-mentorship";
import { adminMentorshipByIdQueryOptions } from "@/lib/api/mentorships-query";

export const Route = createFileRoute(
	"/_auth/_staff/staff/mentorships/$mentorshipId",
)({
	loader: async ({ context, params }) => {
		try {
			return await context.queryClient.ensureQueryData(
				adminMentorshipByIdQueryOptions(
					Number.parseInt(params.mentorshipId, 10),
				),
			);
		} catch (error) {
			if (error instanceof Error && error.message.includes("404 Not Found")) {
				throw redirect({ to: "/staff/mentorships" });
			}
			throw error;
		}
	},
	component: AdminManageMentorshipPage,
});

function AdminManageMentorshipPage() {
	const { mentorshipId } = Route.useParams();

	return (
		<ManageMentorship
			mentorshipId={Number.parseInt(mentorshipId, 10)}
			rootPath="/staff/mentorships"
			studentRootPath="/staff/mentorships/students"
			isAdmin
		/>
	);
}
