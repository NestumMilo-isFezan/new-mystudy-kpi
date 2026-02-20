import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { OverviewComparisonChart } from "@/components/pages/overview/overview-comparison-chart";
import { mentorshipStudentOverviewQueryOptions } from "@/lib/api/mentorship-students-query";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/students/$id/",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			mentorshipStudentOverviewQueryOptions(params.id),
		),
	component: StudentOverviewPage,
});

function StudentOverviewPage() {
	const { id } = Route.useParams();
	const { data: summary } = useSuspenseQuery(
		mentorshipStudentOverviewQueryOptions(id),
	);

	return (
		<div className="space-y-6">
			<OverviewComparisonChart summary={summary} />
		</div>
	);
}
