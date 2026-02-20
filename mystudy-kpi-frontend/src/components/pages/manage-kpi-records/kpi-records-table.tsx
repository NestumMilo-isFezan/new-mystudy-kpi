import {
	type UseSuspenseQueryOptions,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
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
import { TableToolbar } from "@/components/table/core/table-toolbar";
import {
	type KpiRecord,
	kpiRecordsQueryOptions,
} from "@/lib/api/kpi-records-query";

type ActionGroupProps = {
	record: KpiRecord;
	variant: "card" | "cell";
};

type KpiRecordsTableProps = {
	filterType?: string;
	ActionGroup?: ComponentType<ActionGroupProps>;
	queryOptions?: unknown;
	isLecturerMentee?: boolean;
};

export function KpiRecordsTable({
	filterType,
	ActionGroup = KpiRecordActionGroup,
	queryOptions: customQueryOptions = kpiRecordsQueryOptions,
	isLecturerMentee = false,
}: KpiRecordsTableProps) {
	const { data: records } = useSuspenseQuery(
		customQueryOptions as UseSuspenseQueryOptions<KpiRecord[]>,
	);

	const filteredRecords = useMemo(() => {
		if (!filterType) return records;
		return records.filter((r) => r.type === filterType);
	}, [records, filterType]);

	const columns = useMemo(
		() => getKpiRecordTableColumns(ActionGroup),
		[ActionGroup],
	);
	const config = useMemo(
		() => getKpiRecordsTableConfig(filterType, isLecturerMentee),
		[filterType, isLecturerMentee],
	);

	return (
		<TableControl data={filteredRecords} columns={columns} config={config}>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No KPI records match your filters." />
				</div>

				<KpiRecordMobileList ActionGroup={ActionGroup} />
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
