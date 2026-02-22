import {
	type UseSuspenseQueryOptions,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { ColumnFiltersState, Row, SortingState } from "@tanstack/react-table";
import { type ComponentType, useMemo } from "react";
import { AcademicActionGroup } from "@/components/pages/manage-academics/academic-action-group";
import { AcademicCard } from "@/components/pages/manage-academics/academic-card";
import { getAcademicTableColumns } from "@/components/pages/manage-academics/academics-table-columns";
import { academicsTableControlConfig } from "@/components/pages/manage-academics/academics-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import type { AcademicListSearch } from "@/lib/api/academic-list-params";
import type { AcademicRecord } from "@/lib/api/academics.functions";
import { mapAcademicSortToColumn } from "@/lib/api/sort-mappers";

type ActionGroupProps = {
	record: AcademicRecord;
	variant: "card" | "cell";
};

type AcademicsSortedTableProps = {
	queryOptions: unknown;
	params: AcademicListSearch;
	onSortChange: (columnId: string, direction: "asc" | "desc" | "") => void;
	onFilterChange: (columnId: string, value: string) => void;
	ActionGroup?: ComponentType<ActionGroupProps>;
};

export function AcademicsSortedTable({
	queryOptions,
	params,
	onSortChange,
	onFilterChange,
	ActionGroup = AcademicActionGroup,
}: AcademicsSortedTableProps) {
	const { data: academics } = useSuspenseQuery(
		queryOptions as UseSuspenseQueryOptions<AcademicRecord[]>,
	);

	const columns = useMemo(
		() => getAcademicTableColumns(ActionGroup),
		[ActionGroup],
	);

	const initialColumnFilters = useMemo<ColumnFiltersState>(() => {
		const filters: ColumnFiltersState = [];
		if (params.semester != null) {
			filters.push({ id: "semester", value: String(params.semester) });
		}
		return filters;
	}, [params.semester]);

	const initialSorting = useMemo<SortingState>(() => {
		if (!params.sortBy || !params.sortDir) return [];
		const columnId = mapAcademicSortToColumn(params.sortBy);
		if (!columnId) return [];
		return [{ id: columnId, desc: params.sortDir === "desc" }];
	}, [params.sortBy, params.sortDir]);

	return (
		<TableControl
			data={academics}
			columns={columns}
			config={academicsTableControlConfig}
			serverCallbacks={{ onSortChange, onFilterChange }}
			initialColumnFilters={initialColumnFilters}
			initialSorting={initialSorting}
		>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No academic records match your filters." />
				</div>

				<AcademicMobileList ActionGroup={ActionGroup} />
			</div>
		</TableControl>
	);
}

function AcademicMobileList({
	ActionGroup,
}: {
	ActionGroup: ComponentType<ActionGroupProps>;
}) {
	const { table } = useTableContext<AcademicRecord>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<AcademicRecord>) => (
					<AcademicCard
						key={row.id}
						record={row.original}
						ActionGroup={ActionGroup}
					/>
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No academic records match your filters.
				</div>
			)}
		</div>
	);
}
