import { useSuspenseQuery } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { useMemo } from "react";
import { LecturerCard } from "@/components/pages/manage-lecturer/lecturer-card";
import { getLecturerTableColumns } from "@/components/pages/manage-lecturer/lecturer-table-columns";
import { lecturerTableControlConfig } from "@/components/pages/manage-lecturer/lecturer-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import type { Lecturer } from "@/lib/api/lecturers.functions";
import { allLecturersQueryOptions } from "@/lib/api/lecturers-query";

export function LecturerTable() {
	const { data: lecturers } = useSuspenseQuery(allLecturersQueryOptions);

	const columns = useMemo(() => getLecturerTableColumns(), []);

	return (
		<TableControl
			data={lecturers}
			columns={columns}
			config={lecturerTableControlConfig}
		>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No lecturers match your filters." />
				</div>

				<LecturerMobileList />
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
