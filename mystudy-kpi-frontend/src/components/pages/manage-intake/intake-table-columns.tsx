import type { ColumnDef } from "@tanstack/react-table";
import { IntakeActionMenu } from "@/components/pages/manage-intake/intake-action-menu";
import { BadgeCell } from "@/components/table/data/badge-cell";
import { DataCell } from "@/components/table/data/cell";
import { HeaderCell } from "@/components/table/header/cell";
import { FilterCell } from "@/components/table/header/filter-cell";
import { SortCell } from "@/components/table/header/sort-cell";
import type { IntakeBatch } from "@/lib/api/intake-batches.functions";

export const getIntakeTableColumns = (): ColumnDef<IntakeBatch>[] => [
	{
		id: "name",
		accessorKey: "name",
		header: ({ column }) => <SortCell column={column} label="Intake" />,
		cell: ({ row }) => (
			<DataCell value={row.original.name} className="font-medium" />
		),
		meta: {
			hideable: false,
		},
	},
	{
		id: "startYear",
		accessorKey: "startYear",
		header: ({ column }) => <SortCell column={column} label="Start year" />,
		cell: ({ row }) => <DataCell value={row.original.startYear} />,
		meta: {
			hideable: true,
		},
	},
	{
		id: "isActive",
		accessorFn: (row) => (row.isActive ? "active" : "inactive"),
		header: ({ column }) => <FilterCell column={column} label="Status" />,
		cell: ({ row }) => (
			<BadgeCell
				label={row.original.isActive ? "Active" : "Inactive"}
				variant={row.original.isActive ? "default" : "outline"}
			/>
		),
		filterFn: "selectEquals",
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
			<IntakeActionMenu intake={row.original} variant="cell" />
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
