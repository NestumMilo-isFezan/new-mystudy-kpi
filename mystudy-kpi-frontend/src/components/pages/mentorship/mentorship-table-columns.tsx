import type { LinkProps } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MentorshipActionGroup } from "@/components/pages/mentorship/mentorship-action-group";
import { DataCell } from "@/components/table/data/cell";
import { HeaderCell } from "@/components/table/header/cell";
import { SortCell } from "@/components/table/header/sort-cell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Mentorship } from "@/lib/api/mentorships.functions";

export const getMentorshipTableColumns = (
	showLecturer = false,
	rootPath: LinkProps["to"] = "/mentorship",
): ColumnDef<Mentorship>[] => {
	const columns: ColumnDef<Mentorship>[] = [
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
	];

	if (showLecturer) {
		columns.push({
			id: "lecturer",
			accessorFn: (row) =>
				row.lecturer
					? `${row.lecturer.firstName} ${row.lecturer.lastName}`
					: "-",
			filterFn: (row, _columnId, value) => {
				if (!value) return true;
				return row.original.lecturer?.id === String(value);
			},
			header: ({ column }) => <SortCell column={column} label="Lecturer" />,
			cell: ({ row }) => {
				const lecturer = row.original.lecturer;
				if (!lecturer) return <DataCell value="-" />;
				return (
					<div className="flex flex-col">
						<DataCell
							value={`${lecturer.firstName} ${lecturer.lastName}`}
							className="font-medium"
						/>
						<span className="text-[10px] text-muted-foreground uppercase font-mono">
							{lecturer.identifier}
						</span>
					</div>
				);
			},
			meta: {
				hideable: true,
			},
		});
	}

	columns.push(
		{
			id: "intakeBatchName",
			accessorFn: (row) => row.intakeBatch.name,
			header: ({ column }) => <SortCell column={column} label="Intake Batch" />,
			cell: ({ row }) => (
				<DataCell
					value={row.original.intakeBatch.name}
					className="font-medium"
				/>
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
			header: ({ column }) => (
				<SortCell column={column} label="Total Mentees" />
			),
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
				<MentorshipActionGroup
					mentorship={row.original}
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
	);

	return columns;
};
