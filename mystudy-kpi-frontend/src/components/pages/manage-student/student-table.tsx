import { useSuspenseQuery } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { useMemo } from "react";
import { StudentCard } from "@/components/pages/manage-student/student-card";
import { getStudentTableColumns } from "@/components/pages/manage-student/student-table-columns";
import { getStudentTableControlConfig } from "@/components/pages/manage-student/student-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import { allIntakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";
import type { Student } from "@/lib/api/students.functions";
import { allStudentsQueryOptions } from "@/lib/api/students-query";

export function StudentTable() {
	const { data: students } = useSuspenseQuery(allStudentsQueryOptions);
	const { data: intakeBatches } = useSuspenseQuery(
		allIntakeBatchesQueryOptions,
	);

	const columns = useMemo(() => getStudentTableColumns(), []);
	const config = useMemo(
		() => getStudentTableControlConfig(intakeBatches),
		[intakeBatches],
	);

	return (
		<TableControl data={students} columns={columns} config={config}>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No students match your filters." />
				</div>

				<StudentMobileList />
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
