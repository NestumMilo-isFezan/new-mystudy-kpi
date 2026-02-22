import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { IntakeTableSkeleton as KpiTableSkeleton } from "@/components/pages/manage-intake/intake-table-skeleton";
import { KpiRecordsServerTable } from "@/components/pages/manage-kpi-records/kpi-records-server-table";
import type { KpiRecordListSearch } from "@/lib/api/kpi-record-list-params";
import { kpiRecordsPageQueryOptions } from "@/lib/api/kpi-records-query";
import { mapKpiRecordSortColumn } from "@/lib/api/sort-mappers";

export const Route = createFileRoute("/_auth/_student/kpi/records/")({
	component: KpiRecordsIndexPage,
});

function KpiRecordsIndexPage() {
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

	const handleFilterChange = (_columnId: string, _value: string) => {
		// Type filter is controlled by route tabs on this page.
	};

	return (
		<Suspense fallback={<KpiTableSkeleton />}>
			<KpiRecordsServerTable
				pageQueryOptions={kpiRecordsPageQueryOptions(params)}
				pageParams={params}
				onPageChange={handlePageChange}
				onSortChange={handleSortChange}
				onFilterChange={handleFilterChange}
			/>
		</Suspense>
	);
}
