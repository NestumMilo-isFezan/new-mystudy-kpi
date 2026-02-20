import {
	createFileRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { ChevronLeft, Edit3 } from "lucide-react";
import { useCallback } from "react";
import { KpiReportDownloadAction } from "@/components/pages/manage-kpi-target/kpi-report-download-action";
import { Button } from "@/components/ui/button";
import { mentorshipStudentKpiTargetQueryOptions } from "@/lib/api/mentorship-students-query";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/students/$id/kpi-target",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			mentorshipStudentKpiTargetQueryOptions(params.id),
		),
	component: KpiTargetLayout,
});

function KpiTargetLayout() {
	const { id } = Route.useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const queryOptions = mentorshipStudentKpiTargetQueryOptions(id);

	const isAssignPage = location.pathname.endsWith("/assign");

	const handleViewReport = useCallback(() => {
		navigate({
			to: "/mentorship/students/$id/kpi-target",
			params: { id },
		});
	}, [navigate, id]);

	const handleAssignTarget = useCallback(() => {
		navigate({
			to: "/mentorship/students/$id/kpi-target/assign",
			params: { id },
		});
	}, [navigate, id]);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-end gap-2">
				{isAssignPage ? (
					<Button
						variant="outline"
						size="sm"
						onClick={handleViewReport}
						className="w-full md:w-auto"
					>
						<ChevronLeft className="mr-2 size-4" />
						View Report
					</Button>
				) : (
					<>
						<Button
							variant="default"
							size="sm"
							onClick={handleAssignTarget}
							className="w-full md:w-auto"
						>
							<Edit3 className="mr-2 size-4" />
							Assign Target
						</Button>
						<KpiReportDownloadAction queryOptions={queryOptions} size="sm" />
					</>
				)}
			</div>

			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
