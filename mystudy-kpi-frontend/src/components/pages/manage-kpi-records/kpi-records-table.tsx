import { useSuspenseQuery } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { useMemo } from "react";
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

export function KpiRecordsTable({ filterType }: { filterType?: string }) {
	const { data: records } = useSuspenseQuery(kpiRecordsQueryOptions);

	const filteredRecords = useMemo(() => {
		if (!filterType) return records;
		return records.filter((r) => r.type === filterType);
	}, [records, filterType]);

	const columns = useMemo(() => getKpiRecordTableColumns(), []);
	const config = useMemo(
		() => getKpiRecordsTableConfig(filterType),
		[filterType],
	);

	return (
		<TableControl data={filteredRecords} columns={columns} config={config}>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No KPI records match your filters." />
				</div>

				<KpiRecordMobileList />
			</div>
		</TableControl>
	);
}

function KpiRecordMobileList() {
	const { table } = useTableContext<KpiRecord>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<KpiRecord>) => (
					<KpiRecordCard key={row.id} record={row.original} />
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No KPI records match your filters.
				</div>
			)}
		</div>
	);
}
