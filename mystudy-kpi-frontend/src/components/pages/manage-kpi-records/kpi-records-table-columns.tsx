import type { ColumnDef } from "@tanstack/react-table";
import type { ComponentType } from "react";
import { BadgeCell } from "@/components/table/data/badge-cell";
import { DataCell } from "@/components/table/data/cell";
import { HeaderCell } from "@/components/table/header/cell";
import { SortCell } from "@/components/table/header/sort-cell";
import type { KpiRecord } from "@/lib/api/kpi-records-query";

type ActionGroupProps = {
	record: KpiRecord;
	variant: "card" | "cell";
};

export const levelMap: Record<number, string> = {
	0: "Faculty",
	1: "University",
	2: "Local",
	3: "National",
	4: "International",
};

export const categoryMap: Record<number, string> = {
	0: "Professional",
	1: "Technical",
};

const typeMap: Record<string, string> = {
	activity: "Activity",
	competition: "Competition",
	certification: "Certification",
};

export const getKpiRecordTableColumns = (
	ActionGroup: ComponentType<ActionGroupProps>,
): ColumnDef<KpiRecord>[] => [
	{
		id: "index",
		header: "No.",
		cell: ({ row }) => <DataCell value={row.index + 1} />,
		enableSorting: false,
		meta: { hideable: false },
	},
	{
		id: "title",
		accessorKey: "title",
		header: ({ column }) => <SortCell column={column} label="Title" />,
		cell: ({ row }) => (
			<div className="flex flex-col gap-0.5">
				<DataCell value={row.original.title} className="font-medium" />
				{row.original.description && (
					<span className="text-[10px] text-muted-foreground line-clamp-1">
						{row.original.description}
					</span>
				)}
			</div>
		),
		meta: { hideable: false },
	},
	{
		id: "semester",
		accessorFn: (row) => row.semester.termString,
		header: ({ column }) => <SortCell column={column} label="Semester" />,
		cell: ({ row }) => <DataCell value={row.original.semester.termString} />,
		meta: { hideable: true },
	},
	{
		id: "type",
		accessorKey: "type",
		header: ({ column }) => <SortCell column={column} label="Type" />,
		cell: ({ row }) => (
			<BadgeCell
				label={typeMap[row.original.type] || row.original.type}
				variant="outline"
			/>
		),
		meta: { hideable: true },
	},
	{
		id: "level",
		accessorKey: "level",
		header: ({ column }) => <SortCell column={column} label="Level" />,
		cell: ({ row }) => <DataCell value={levelMap[row.original.level ?? 0]} />,
		meta: { hideable: true },
	},
	{
		id: "category",
		accessorKey: "category",
		header: ({ column }) => <SortCell column={column} label="Category" />,
		cell: ({ row }) => (
			<DataCell value={categoryMap[row.original.category ?? 0]} />
		),
		meta: { hideable: true },
	},
	{
		id: "achievements",
		header: "Achievements",
		cell: ({ row }) => {
			const record = row.original;
			if (record.type === "certification") {
				return <DataCell value={categoryMap[record.category ?? 0]} />;
			}
			return <DataCell value={levelMap[record.level ?? 0]} />;
		},
		meta: { hideable: true },
	},
	{
		id: "actions",
		header: () => (
			<HeaderCell className="justify-end">
				<span>Actions</span>
			</HeaderCell>
		),
		cell: ({ row }) => <ActionGroup record={row.original} variant="cell" />,
		enableSorting: false,
		meta: {
			sticky: "right",
			isAction: true,
			align: "end",
			hideable: false,
		},
	},
];
