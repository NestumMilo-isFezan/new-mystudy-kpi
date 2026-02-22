import {
	type UseSuspenseQueryOptions,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { ColumnFiltersState, Row, SortingState } from "@tanstack/react-table";
import { type ComponentType, useMemo } from "react";
import { KpiRecordActionGroup } from "@/components/pages/manage-kpi-records/kpi-record-action-group";
import { KpiRecordCard } from "@/components/pages/manage-kpi-records/kpi-record-card";
import { getKpiRecordTableColumns } from "@/components/pages/manage-kpi-records/kpi-records-table-columns";
import { getKpiRecordsTableConfig } from "@/components/pages/manage-kpi-records/kpi-records-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TablePagination } from "@/components/table/core/table-pagination";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import type { KpiRecordListSearch } from "@/lib/api/kpi-record-list-params";
import type { KpiRecord } from "@/lib/api/kpi-records.functions";
import type { PaginatedResponse } from "@/lib/api/server-function-types";

type ActionGroupProps = {
	record: KpiRecord;
	variant: "card" | "cell";
};

type KpiRecordsServerTableProps = {
	pageQueryOptions: unknown;
	pageParams: KpiRecordListSearch;
	onPageChange: (page: number) => void;
	onSortChange: (columnId: string, direction: "asc" | "desc" | "") => void;
	onFilterChange: (columnId: string, value: string) => void;
	ActionGroup?: ComponentType<ActionGroupProps>;
	isLecturerMentee?: boolean;
};

export function KpiRecordsServerTable({
	pageQueryOptions,
	pageParams,
	onPageChange,
	onSortChange,
	onFilterChange,
	ActionGroup = KpiRecordActionGroup,
	isLecturerMentee = false,
}: KpiRecordsServerTableProps) {
	const { data: pageData } = useSuspenseQuery(
		pageQueryOptions as UseSuspenseQueryOptions<PaginatedResponse<KpiRecord>>,
	);

	const columns = useMemo(
		() => getKpiRecordTableColumns(ActionGroup),
		[ActionGroup],
	);
	const config = useMemo(
		() => getKpiRecordsTableConfig(pageParams.type, isLecturerMentee),
		[pageParams.type, isLecturerMentee],
	);

	const initialColumnFilters = useMemo<ColumnFiltersState>(() => {
		const filters: ColumnFiltersState = [];
		if (isLecturerMentee && pageParams.type) {
			filters.push({ id: "type", value: pageParams.type });
		}
		return filters;
	}, [isLecturerMentee, pageParams.type]);

	const initialSorting = useMemo<SortingState>(() => {
		if (!pageParams.sortBy || !pageParams.sortDir) return [];
		return [{ id: pageParams.sortBy, desc: pageParams.sortDir === "desc" }];
	}, [pageParams.sortBy, pageParams.sortDir]);

	return (
		<TableControl
			data={pageData.items}
			columns={columns}
			config={config}
			serverPagination={{
				meta: pageData.pagination,
				page: pageParams.page,
				onPageChange,
			}}
			serverCallbacks={{
				onSortChange,
				onFilterChange,
			}}
			initialColumnFilters={initialColumnFilters}
			initialSorting={initialSorting}
		>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No KPI records match your filters." />
				</div>

				<KpiRecordMobileList ActionGroup={ActionGroup} />

				<TablePagination />
			</div>
		</TableControl>
	);
}

function KpiRecordMobileList({
	ActionGroup,
}: {
	ActionGroup: ComponentType<ActionGroupProps>;
}) {
	const { table } = useTableContext<KpiRecord>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<KpiRecord>) => (
					<KpiRecordCard
						key={row.id}
						record={row.original}
						ActionGroup={ActionGroup}
					/>
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No KPI records match your filters.
				</div>
			)}
		</div>
	);
}
