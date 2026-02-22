import { useSuspenseQuery } from "@tanstack/react-query";
import type { ColumnFiltersState, Row, SortingState } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { IntakeCard } from "@/components/pages/manage-intake/intake-card";
import { getIntakeTableColumns } from "@/components/pages/manage-intake/intake-table-columns";
import { intakeTableControlConfig } from "@/components/pages/manage-intake/intake-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TablePagination } from "@/components/table/core/table-pagination";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import type { IntakeListSearch } from "@/lib/api/intake-list-params";
import { intakeBatchesPageQueryOptions, type IntakeBatch } from "@/lib/api/intake-batches-query";
import { mapIntakeSortColumn } from "@/lib/api/sort-mappers";
import { Route } from "@/routes/_auth/_staff/staff/intake/index";

export function IntakeTable() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const params = {
		page: search.page ?? 1,
		limit: search.limit ?? 25,
		sortBy: search.sortBy,
		sortDir: search.sortDir,
		status: search.status,
	};

	const { data } = useSuspenseQuery(intakeBatchesPageQueryOptions(params));

	const columns = useMemo(() => getIntakeTableColumns(), []);

	const initialColumnFilters = useMemo<ColumnFiltersState>(() => {
		const filters: ColumnFiltersState = [];
		if (params.status) {
			filters.push({ id: "isActive", value: params.status });
		}
		return filters;
	}, [params.status]);

	const initialSorting = useMemo<SortingState>(() => {
		if (!params.sortBy || !params.sortDir) return [];
		return [{ id: params.sortBy, desc: params.sortDir === "desc" }];
	}, [params.sortBy, params.sortDir]);

	const handlePageChange = (page: number) => {
		navigate({ search: (prev: IntakeListSearch) => ({ ...prev, page }) });
	};

	const handleSortChange = (columnId: string, direction: "asc" | "desc" | "") => {
		const sortBy = mapIntakeSortColumn(columnId);
		navigate({
			search: (prev: IntakeListSearch) => ({
				...prev,
				page: 1,
				sortBy: sortBy && direction ? sortBy : undefined,
				sortDir: direction || undefined,
			}),
		});
	};

	const handleFilterChange = (columnId: string, value: string) => {
		if (columnId !== "isActive") return;
		navigate({
			search: (prev: IntakeListSearch) => ({
				...prev,
				page: 1,
				status: value ? (value as IntakeListSearch["status"]) : undefined,
			}),
		});
	};

	return (
		<TableControl
			data={data.items}
			columns={columns}
			config={intakeTableControlConfig}
			serverPagination={{
				meta: data.pagination,
				page: params.page,
				onPageChange: handlePageChange,
			}}
			serverCallbacks={{
				onSortChange: handleSortChange,
				onFilterChange: handleFilterChange,
			}}
			initialColumnFilters={initialColumnFilters}
			initialSorting={initialSorting}
		>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No intakes match your filters." />
				</div>

				<IntakeMobileList />

				<TablePagination />
			</div>
		</TableControl>
	);
}

function IntakeMobileList() {
	const { table } = useTableContext<IntakeBatch>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<IntakeBatch>) => (
					<IntakeCard key={row.id} intake={row.original} />
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No intakes match your filters.
				</div>
			)}
		</div>
	);
}
