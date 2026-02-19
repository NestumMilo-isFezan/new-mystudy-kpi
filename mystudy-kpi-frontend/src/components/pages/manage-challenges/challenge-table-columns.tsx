import type { ColumnDef } from "@tanstack/react-table";
import { ChallengeActionGroup } from "@/components/pages/manage-challenges/challenge-action-group";
import { DataCell } from "@/components/table/data/cell";
import { HeaderCell } from "@/components/table/header/cell";
import { SortCell } from "@/components/table/header/sort-cell";
import type { Challenge } from "@/lib/api/challenges.functions";

export const getChallengeTableColumns = (): ColumnDef<Challenge>[] => [
	{
		id: "index",
		header: "No.",
		cell: ({ row }) => <DataCell value={row.index + 1} />,
		enableSorting: false,
		meta: { hideable: false },
	},
	{
		id: "semester",
		accessorFn: (row) => row.semester.termString,
		header: ({ column }) => <SortCell column={column} label="Semester" />,
		cell: ({ row }) => (
			<DataCell
				value={row.original.semester.termString}
				className="font-medium"
			/>
		),
		meta: { hideable: false },
	},
	{
		id: "challenge",
		accessorKey: "challenge",
		header: ({ column }) => <SortCell column={column} label="Challenge" />,
		cell: ({ row }) => (
			<div className="max-w-[300px]">
				<DataCell
					value={row.original.challenge}
					className="whitespace-normal line-clamp-2"
				/>
			</div>
		),
		meta: { hideable: false },
	},
	{
		id: "plan",
		accessorKey: "plan",
		header: ({ column }) => <SortCell column={column} label="Plan" />,
		cell: ({ row }) => (
			<div className="max-w-[300px]">
				<DataCell
					value={row.original.plan}
					className="whitespace-normal line-clamp-2 italic text-muted-foreground"
				/>
			</div>
		),
		meta: { hideable: true },
	},
	{
		id: "actions",
		header: () => (
			<HeaderCell className="justify-end">
				<span>Actions</span>
			</HeaderCell>
		),
		cell: ({ row }) => (
			<ChallengeActionGroup challenge={row.original} variant="cell" />
		),
		enableSorting: false,
		meta: {
			sticky: "right",
			isAction: true,
			align: "end",
			hideable: false,
		},
	},
];
