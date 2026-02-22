import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KpiRecordsServerTable } from "@/components/pages/manage-kpi-records/kpi-records-server-table";
import type { KpiRecord } from "@/lib/api/kpi-records.functions";
import type { KpiRecordListSearch } from "@/lib/api/kpi-record-list-params";
import { kpiRecordListSearchSchema } from "@/lib/api/kpi-record-list-params";
import { mapKpiRecordSortColumn } from "@/lib/api/sort-mappers";
import { adminStudentKpiRecordsPageQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute(
	"/_auth/_staff/staff/students/$id/kpi-records",
)({
	validateSearch: (search) => kpiRecordListSearchSchema.parse(search),
	loader: ({ context, params, location }) => {
		const search = kpiRecordListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		return context.queryClient.ensureQueryData(
			adminStudentKpiRecordsPageQueryOptions(params.id, search),
		);
	},
	component: AdminStudentKpiRecordsPage,
});

type ActionGroupProps = {
	record: KpiRecord;
	variant: "card" | "cell";
};

function StaffKpiRecordActionGroup(_props: ActionGroupProps) {
	return null;
}

function AdminStudentKpiRecordsPage() {
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
				ActionGroup={StaffKpiRecordActionGroup}
				pageQueryOptions={adminStudentKpiRecordsPageQueryOptions(id, params)}
				pageParams={params}
				onPageChange={handlePageChange}
				onSortChange={handleSortChange}
				onFilterChange={handleFilterChange}
				isLecturerMentee={true} // Enable filtering for staff too
			/>
		</div>
	);
}
