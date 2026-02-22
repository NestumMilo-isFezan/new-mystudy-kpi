import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KpiRecordsServerTable } from "@/components/pages/manage-kpi-records/kpi-records-server-table";
import { LecturerKpiRecordActionGroup } from "@/components/pages/manage-kpi-records/lecturer-action-group";
import type { KpiRecordListSearch } from "@/lib/api/kpi-record-list-params";
import { kpiRecordListSearchSchema } from "@/lib/api/kpi-record-list-params";
import { mentorshipStudentKpiRecordsPageQueryOptions } from "@/lib/api/mentorship-students-query";
import { mapKpiRecordSortColumn } from "@/lib/api/sort-mappers";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/students/$id/kpi-records",
)({
	validateSearch: (search) => kpiRecordListSearchSchema.parse(search),
	loader: ({ context, params, location }) => {
		const search = kpiRecordListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		return context.queryClient.ensureQueryData(
			mentorshipStudentKpiRecordsPageQueryOptions(params.id, search),
		);
	},
	component: StudentKpiRecordsPage,
});

function StudentKpiRecordsPage() {
	const { id } = Route.useParams();
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const params = {
		page: search.page ?? 1,
		limit: search.limit ?? 25,
		sortBy: search.sortBy,
		sortDir: search.sortDir,
		type: search.type,
	};

	const handlePageChange = (page: number) => {
		navigate({ search: (prev: KpiRecordListSearch) => ({ ...prev, page }) });
	};

	const handleSortChange = (
		columnId: string,
		direction: "asc" | "desc" | "",
	) => {
		const sortBy = mapKpiRecordSortColumn(columnId);
		navigate({
			search: (prev: KpiRecordListSearch) => ({
				...prev,
				page: 1,
				sortBy: sortBy && direction ? sortBy : undefined,
				sortDir: direction || undefined,
			}),
		});
	};

	const handleFilterChange = (columnId: string, value: string) => {
		if (columnId !== "type") return;
		navigate({
			search: (prev: KpiRecordListSearch) => ({
				...prev,
				page: 1,
				type: value ? (value as KpiRecordListSearch["type"]) : undefined,
			}),
		});
	};

	return (
		<div className="space-y-6">
			<KpiRecordsServerTable
				ActionGroup={LecturerKpiRecordActionGroup}
				pageQueryOptions={mentorshipStudentKpiRecordsPageQueryOptions(id, params)}
				pageParams={params}
				onPageChange={handlePageChange}
				onSortChange={handleSortChange}
				onFilterChange={handleFilterChange}
				isLecturerMentee={true}
			/>
		</div>
	);
}
