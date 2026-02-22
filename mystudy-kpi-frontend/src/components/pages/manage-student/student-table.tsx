import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { ColumnFiltersState, Row, SortingState } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import { StudentCard } from "@/components/pages/manage-student/student-card";
import { getStudentTableColumns } from "@/components/pages/manage-student/student-table-columns";
import { getStudentTableControlConfig } from "@/components/pages/manage-student/student-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TablePagination } from "@/components/table/core/table-pagination";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import { allIntakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";
import type { PaginatedListSearch, SortableUserColumn } from "@/lib/api/list-params";
import type { Student } from "@/lib/api/students.functions";
import { studentsPageQueryOptions } from "@/lib/api/students-query";
import { Route } from "@/routes/_auth/_staff/staff/students/index";

const PAGE_SIZE = 25;

function mapStudentColumnToSortable(columnId: string): SortableUserColumn | undefined {
	if (columnId === "identifier") return "identifier";
	if (columnId === "email") return "email";
	if (columnId === "startYear") return "startYear";
	if (columnId === "fullName") return "lastName";
	return undefined;
}

function mapSortableToStudentColumn(sortBy?: SortableUserColumn): string | undefined {
	if (!sortBy) return undefined;
	if (sortBy === "lastName" || sortBy === "firstName") return "fullName";
	return sortBy;
}

export function StudentTable() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const queryClient = useQueryClient();

	const params = useMemo(
		() => ({
			page: search.page ?? 1,
			limit: PAGE_SIZE,
			sortBy: search.sortBy,
			sortDir: search.sortDir,
			startYear: search.startYear,
		}),
		[search],
	);

	const { data } = useSuspenseQuery(studentsPageQueryOptions(params));
	const { data: intakeBatches } = useSuspenseQuery(allIntakeBatchesQueryOptions);

	// Prefetch next page to avoid spinner on navigation
	useEffect(() => {
		if (params.page < data.pagination.totalPages) {
			queryClient.prefetchQuery(
				studentsPageQueryOptions({ ...params, page: params.page + 1 }),
			);
		}
	}, [params, data.pagination.totalPages, queryClient]);

	const columns = useMemo(() => getStudentTableColumns(), []);
	const config = useMemo(
		() => getStudentTableControlConfig(intakeBatches),
		[intakeBatches],
	);

	// Derive initial TanStack Table state from URL so the dropdown/sort UI reflects the URL on mount
	// and stays in sync on browser back/forward navigation.
	const initialColumnFilters = useMemo<ColumnFiltersState>(() => {
		const filters: ColumnFiltersState = [];
		if (search.startYear != null) {
			filters.push({ id: "startYear", value: String(search.startYear) });
		}
		return filters;
	}, [search.startYear]);

	const initialSorting = useMemo<SortingState>(() => {
		if (!search.sortBy || !search.sortDir) return [];
		const columnId = mapSortableToStudentColumn(search.sortBy);
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
			const mappedSortBy = mapStudentColumnToSortable(columnId);
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

	const handleFilterChange = useCallback(
		(columnId: string, value: string) => {
			if (columnId === "startYear") {
				navigate({
					search: (prev: PaginatedListSearch) => ({
						...prev,
						page: 1,
						startYear: value ? Number(value) : undefined,
					}),
				});
			}
		},
		[navigate],
	);

	return (
		<TableControl
			data={data.items}
			columns={columns}
			config={config}
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
					<CoreTable emptyMessage="No students match your filters." />
				</div>

				<StudentMobileList />

				<TablePagination />
			</div>
		</TableControl>
	);
}

function StudentMobileList() {
	const { table } = useTableContext<Student>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<Student>) => (
					<StudentCard key={row.id} student={row.original} />
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No students match your filters.
				</div>
			)}
		</div>
	);
}
