import type { ColumnDef } from "@tanstack/react-table";
import { StudentActionGroup } from "@/components/pages/manage-student/student-action-group";
import { DataCell } from "@/components/table/data/cell";
import { HeaderCell } from "@/components/table/header/cell";
import { SortCell } from "@/components/table/header/sort-cell";
import type { Student } from "@/lib/api/students.functions";

export const getStudentTableColumns = (): ColumnDef<Student>[] => [
	{
		id: "identifier",
		accessorKey: "identifier",
		header: ({ column }) => <SortCell column={column} label="Student ID" />,
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
		id: "intakeName",
		accessorFn: (row) => row.intake?.name,
		header: () => <HeaderCell>Intake</HeaderCell>,
		cell: ({ row }) => <DataCell value={row.original.intake?.name ?? "-"} />,
		enableSorting: false,
		meta: {
			hideable: true,
		},
	},
	{
		id: "startYear",
		accessorFn: (row) => row.intake?.startYear,
		filterFn: "selectEquals",
		header: ({ column }) => <SortCell column={column} label="Start Year" />,
		cell: ({ row }) => (
			<DataCell value={row.original.intake?.startYear?.toString() ?? "-"} />
		),
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
			<StudentActionGroup student={row.original} variant="cell" />
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
