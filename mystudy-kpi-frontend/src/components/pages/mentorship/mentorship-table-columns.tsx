import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MentorshipActionGroup } from "@/components/pages/mentorship/mentorship-action-group";
import { DataCell } from "@/components/table/data/cell";
import { HeaderCell } from "@/components/table/header/cell";
import { SortCell } from "@/components/table/header/sort-cell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Mentorship } from "@/lib/api/mentorships.functions";

export const getMentorshipTableColumns = (): ColumnDef<Mentorship>[] => [
	{
		id: "expander",
		header: () => <div className="w-8" />,
		cell: ({ row }) => {
			return (
				<Button
					variant="ghost"
					size="icon-sm"
					className="h-6 w-6"
					onClick={row.getToggleExpandedHandler()}
				>
					{row.getIsExpanded() ? (
						<ChevronDown className="h-4 w-4" />
					) : (
						<ChevronRight className="h-4 w-4" />
					)}
				</Button>
			);
		},
		meta: {
			hideable: false,
		},
	},
	{
		id: "intakeBatchName",
		accessorFn: (row) => row.intakeBatch.name,
		header: ({ column }) => <SortCell column={column} label="Intake Batch" />,
		cell: ({ row }) => (
			<DataCell value={row.original.intakeBatch.name} className="font-medium" />
		),
		footer: () => <span className="font-bold">Total</span>,
		meta: {
			hideable: false,
		},
	},
	{
		id: "startYear",
		accessorFn: (row) => row.intakeBatch.startYear,
		filterFn: "selectEquals",
		header: ({ column }) => <SortCell column={column} label="Start Year" />,
		cell: ({ row }) => (
			<DataCell value={row.original.intakeBatch.startYear.toString()} />
		),
		meta: {
			hideable: true,
		},
	},
	{
		id: "menteeCount",
		accessorKey: "menteeCount",
		header: ({ column }) => <SortCell column={column} label="Total Mentees" />,
		cell: ({ row }) => (
			<Badge variant="secondary" className="font-mono">
				{row.original.menteeCount}
			</Badge>
		),
		footer: (info) => {
			const total = info.table
				.getFilteredRowModel()
				.rows.reduce((sum, row) => sum + row.original.menteeCount, 0);
			return (
				<Badge variant="outline" className="font-mono">
					{total}
				</Badge>
			);
		},
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
			<MentorshipActionGroup mentorship={row.original} variant="cell" />
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
