import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { Row, SortingState } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import { LecturerCard } from "@/components/pages/manage-lecturer/lecturer-card";
import { getLecturerTableColumns } from "@/components/pages/manage-lecturer/lecturer-table-columns";
import { lecturerTableControlConfig } from "@/components/pages/manage-lecturer/lecturer-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TablePagination } from "@/components/table/core/table-pagination";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import type { PaginatedListSearch, SortableUserColumn } from "@/lib/api/list-params";
import type { Lecturer } from "@/lib/api/lecturers.functions";
import { lecturersPageQueryOptions } from "@/lib/api/lecturers-query";
import { Route } from "@/routes/_auth/_staff/staff/manage-lecturers";

const PAGE_SIZE = 25;

function mapLecturerColumnToSortable(
	columnId: string,
): SortableUserColumn | undefined {
	if (columnId === "identifier") return "identifier";
	if (columnId === "email") return "email";
	if (columnId === "fullName") return "lastName";
	return undefined;
}

function mapSortableToLecturerColumn(sortBy?: SortableUserColumn): string | undefined {
	if (!sortBy) return undefined;
	if (sortBy === "lastName" || sortBy === "firstName") return "fullName";
	if (sortBy === "startYear") return undefined;
	return sortBy;
}

export function LecturerTable() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const queryClient = useQueryClient();

	const params = useMemo(
		() => ({
			page: search.page ?? 1,
			limit: PAGE_SIZE,
			sortBy: search.sortBy,
			sortDir: search.sortDir,
		}),
		[search],
	);

	const { data } = useSuspenseQuery(lecturersPageQueryOptions(params));

	// Prefetch next page to avoid spinner on navigation
	useEffect(() => {
		if (params.page < data.pagination.totalPages) {
			queryClient.prefetchQuery(
				lecturersPageQueryOptions({ ...params, page: params.page + 1 }),
			);
		}
	}, [params, data.pagination.totalPages, queryClient]);

	const columns = useMemo(() => getLecturerTableColumns(), []);

	const initialSorting = useMemo<SortingState>(() => {
		if (!search.sortBy || !search.sortDir) return [];
		const columnId = mapSortableToLecturerColumn(search.sortBy);
		if (!columnId) return [];
		return [{ id: columnId, desc: search.sortDir === "desc" }];
	}, [search.sortBy, search.sortDir]);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate({ search: (prev: PaginatedListSearch) => ({ ...prev, page }) });
		},
		[navigate],
	);

	const handleSortChange = useCallback(
		(columnId: string, direction: "asc" | "desc" | "") => {
			const mappedSortBy = mapLecturerColumnToSortable(columnId);
			navigate({
				search: (prev: PaginatedListSearch) => ({
					...prev,
					page: 1,
					sortBy: mappedSortBy && direction ? mappedSortBy : undefined,
					sortDir: direction || undefined,
				}),
			});
		},
		[navigate],
	);

	return (
		<TableControl
			data={data.items}
			columns={columns}
			config={lecturerTableControlConfig}
			serverPagination={{
				meta: data.pagination,
				page: params.page,
				onPageChange: handlePageChange,
			}}
			serverCallbacks={{
				onSortChange: handleSortChange,
			}}
			initialSorting={initialSorting}
		>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No lecturers match your filters." />
				</div>

				<LecturerMobileList />

				<TablePagination />
			</div>
		</TableControl>
	);
}

function LecturerMobileList() {
	const { table } = useTableContext<Lecturer>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<Lecturer>) => (
					<LecturerCard key={row.id} lecturer={row.original} />
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No lecturers match your filters.
				</div>
			)}
		</div>
	);
}
