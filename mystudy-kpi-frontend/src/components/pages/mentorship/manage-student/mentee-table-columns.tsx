import type { ColumnDef } from "@tanstack/react-table";
import { MenteeActionGroup } from "@/components/pages/mentorship/manage-student/mentee-action-group";
import { DataCell } from "@/components/table/data/cell";
import { HeaderCell } from "@/components/table/header/cell";
import { SortCell } from "@/components/table/header/sort-cell";
import type { Student } from "@/lib/api/students.functions";

export const getMenteeTableColumns = (
	rootPath = "/mentorship",
): ColumnDef<Student>[] => [
	{
		id: "identifier",
		accessorKey: "identifier",
		header: ({ column }) => <SortCell column={column} label="Student ID" />,
		cell: ({ row }) => (
			<DataCell value={row.original.identifier} className="font-mono" />
		),
		meta: {
			hideable: false,
		},
	},
	{
		id: "fullName",
		header: ({ column }) => <SortCell column={column} label="Full Name" />,
		accessorFn: (row) => `${row.firstName} ${row.lastName}`,
		cell: ({ row }) => (
			<DataCell
				value={`${row.original.firstName} ${row.original.lastName}`}
				className="capitalize"
			/>
		),
		meta: {
			hideable: true,
		},
	},
	{
		id: "email",
		accessorKey: "email",
		header: ({ column }) => <SortCell column={column} label="Email" />,
		cell: ({ row }) => <DataCell value={row.original.email} />,
		meta: {
			hideable: true,
		},
	},
	{
		id: "actions",
		header: () => (
			<HeaderCell className="justify-end">
				<span>Actions</span>
			</HeaderCell>
		),
		cell: ({ row }) => (
			<MenteeActionGroup
				student={row.original}
				variant="cell"
				rootPath={rootPath}
			/>
		),
		enableSorting: false,
		enableColumnFilter: false,
		meta: {
			sticky: "right",
			isAction: true,
			align: "end",
			hideable: false,
		},
	},
];
