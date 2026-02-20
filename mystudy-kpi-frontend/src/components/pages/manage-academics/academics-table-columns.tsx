import type { ColumnDef } from "@tanstack/react-table";
import type { ComponentType } from "react";
import { BadgeCell } from "@/components/table/data/badge-cell";
import { DataCell } from "@/components/table/data/cell";
import { HeaderCell } from "@/components/table/header/cell";
import { SortCell } from "@/components/table/header/sort-cell";
import type { AcademicRecord } from "@/lib/api/academics-query";
import { cn } from "@/lib/utils";

type ActionGroupProps = {
	record: AcademicRecord;
	variant: "card" | "cell";
};

export const getAcademicTableColumns = (
	ActionGroup: ComponentType<ActionGroupProps>,
): ColumnDef<AcademicRecord>[] => [
	{
		id: "semester",
		accessorKey: "semester",
		header: "Semester",
		filterFn: "selectEquals",
		cell: ({ row }) => <DataCell value={row.original.semester} />,
		meta: {
			hideable: false,
		},
	},
	{
		id: "termString",
		accessorKey: "termString",
		header: ({ column }) => <SortCell column={column} label="Term" />,
		cell: ({ row }) => {
			const record = row.original;
			return (
				<div className="flex items-center gap-2">
					<DataCell value={record.termString} className="font-medium" />
					{record.isShortSemester && (
						<BadgeCell label="Short" variant="secondary" />
					)}
				</div>
			);
		},
		meta: {
			hideable: false,
		},
	},
	{
		id: "academicYearString",
		accessorKey: "academicYearString",
		header: ({ column }) => <SortCell column={column} label="Academic Year" />,
		cell: ({ row }) => <DataCell value={row.original.academicYearString} />,
		meta: {
			hideable: true,
		},
	},
	{
		id: "gpa",
		accessorKey: "gpa",
		header: ({ column }) => <SortCell column={column} label="GPA" />,
		cell: ({ row }) => {
			const { gpa: gpaValue } = row.original;

			if (gpaValue === null) {
				return (
					<DataCell
						value="Not Taken"
						className="font-mono font-bold text-muted-foreground"
					/>
				);
			}

			const gpa = Number.parseFloat(gpaValue);
			return (
				<DataCell
					value={gpaValue}
					className={cn(
						"font-mono font-bold",
						gpa >= 3.5
							? "text-primary"
							: gpa >= 2.0
								? "text-foreground"
								: "text-destructive",
					)}
				/>
			);
		},
		meta: {
			hideable: false,
		},
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
		enableColumnFilter: false,
		meta: {
			sticky: "right",
			isAction: true,
			align: "end",
			hideable: false,
		},
	},
];
