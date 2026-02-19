import { useSuspenseQuery } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { useMemo } from "react";
import { AcademicCard } from "@/components/pages/manage-academics/academic-card";
import { getAcademicTableColumns } from "@/components/pages/manage-academics/academics-table-columns";
import { academicsTableControlConfig } from "@/components/pages/manage-academics/academics-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import {
	type AcademicRecord,
	academicsQueryOptions,
} from "@/lib/api/academics-query";

export function AcademicsTable() {
	const { data: academics } = useSuspenseQuery(academicsQueryOptions);

	const columns = useMemo(() => getAcademicTableColumns(), []);

	return (
		<TableControl
			data={academics}
			columns={columns}
			config={academicsTableControlConfig}
		>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No academic records match your filters." />
				</div>

				<AcademicMobileList />
			</div>
		</TableControl>
	);
}

function AcademicMobileList() {
	const { table } = useTableContext<AcademicRecord>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<AcademicRecord>) => (
					<AcademicCard key={row.id} record={row.original} />
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No academic records match your filters.
				</div>
			)}
		</div>
	);
}
