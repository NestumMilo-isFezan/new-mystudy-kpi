import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { OverviewComparisonChart } from "@/components/pages/overview/overview-comparison-chart";
import { adminStudentOverviewQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute("/_auth/_staff/staff/students/$id/")({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			adminStudentOverviewQueryOptions(params.id),
		),
	component: AdminStudentOverviewPage,
});

function AdminStudentOverviewPage() {
	const { id } = Route.useParams();
	const { data: summary } = useSuspenseQuery(
		adminStudentOverviewQueryOptions(id),
	);

	return (
		<div className="space-y-6">
			<OverviewComparisonChart summary={summary} />
		</div>
	);
}
