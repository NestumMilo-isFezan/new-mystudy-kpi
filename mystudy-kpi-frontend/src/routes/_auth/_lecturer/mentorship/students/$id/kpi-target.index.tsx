import { createFileRoute } from "@tanstack/react-router";
import { KpiTargetReport } from "@/components/pages/manage-kpi-target/kpi-target-report";
import { mentorshipStudentKpiTargetQueryOptions } from "@/lib/api/mentorship-students-query";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/students/$id/kpi-target/",
)({
	component: KpiTargetReportPage,
});

function KpiTargetReportPage() {
	const { id } = Route.useParams();
	const queryOptions = mentorshipStudentKpiTargetQueryOptions(id);

	return <KpiTargetReport queryOptions={queryOptions} />;
}
