import { useSuspenseQuery } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { useMemo } from "react";
import { IntakeCard } from "@/components/pages/manage-intake/intake-card";
import { getIntakeTableColumns } from "@/components/pages/manage-intake/intake-table-columns";
import { intakeTableControlConfig } from "@/components/pages/manage-intake/intake-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import {
	allIntakeBatchesQueryOptions,
	type IntakeBatch,
} from "@/lib/api/intake-batches-query";

export function IntakeTable() {
	const { data: intakeBatches } = useSuspenseQuery(
		allIntakeBatchesQueryOptions,
	);

	const columns = useMemo(() => getIntakeTableColumns(), []);

	return (
		<TableControl
			data={intakeBatches}
			columns={columns}
			config={intakeTableControlConfig}
		>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No intakes match your filters." />
				</div>

				<IntakeMobileList />
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
