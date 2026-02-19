import type { ColumnDef } from "@tanstack/react-table";
import { LecturerActionMenu } from "@/components/pages/manage-lecturer/lecturer-action-menu";
import { DataCell } from "@/components/table/data/cell";
import { HeaderCell } from "@/components/table/header/cell";
import { SortCell } from "@/components/table/header/sort-cell";
import type { Lecturer } from "@/lib/api/lecturers.functions";

export const getLecturerTableColumns = (): ColumnDef<Lecturer>[] => [
	{
		id: "identifier",
		accessorKey: "identifier",
		header: ({ column }) => <SortCell column={column} label="Lecturer ID" />,
		cell: ({ row }) => (
			<DataCell value={row.original.identifier} className="font-medium" />
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
			<LecturerActionMenu lecturer={row.original} variant="cell" />
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
