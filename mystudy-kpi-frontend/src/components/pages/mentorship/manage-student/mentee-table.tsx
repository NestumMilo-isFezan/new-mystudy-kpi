import type { Row } from "@tanstack/react-table";
import { useMemo } from "react";
import { MenteeCard } from "@/components/pages/mentorship/manage-student/mentee-card";
import { getMenteeTableColumns } from "@/components/pages/mentorship/manage-student/mentee-table-columns";
import { getMenteeTableControlConfig } from "@/components/pages/mentorship/manage-student/mentee-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import type { Student } from "@/lib/api/students.functions";

type MenteeTableProps = {
	mentees: Student[];
};

export function MenteeTable({ mentees }: MenteeTableProps) {
	const columns = useMemo(() => getMenteeTableColumns(), []);
	const config = useMemo(() => getMenteeTableControlConfig(), []);

	return (
		<TableControl data={mentees} columns={columns} config={config}>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No students match your filters." />
				</div>

				<MenteeMobileList />
			</div>
		</TableControl>
	);
}

function MenteeMobileList() {
	const { table } = useTableContext<Student>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<Student>) => (
					<MenteeCard key={row.id} student={row.original} />
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No mentees match your filters.
				</div>
			)}
		</div>
	);
}
