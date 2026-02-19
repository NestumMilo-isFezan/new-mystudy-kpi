import type { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import { useTableContext } from "@/components/table/core/table-control";
import { HeaderCell } from "@/components/table/header/cell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SortCellProps<TData> = {
	column: Column<TData, unknown>;
	label: string;
};

export function SortCell<TData>({ column, label }: SortCellProps<TData>) {
	const { setSort } = useTableContext();
	const sortState = column.getIsSorted();

	const handleSort = () => {
		if (!sortState) {
			setSort(column.id, "asc");
		} else if (sortState === "asc") {
			setSort(column.id, "desc");
		} else {
			setSort("", "");
		}
	};

	return (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			onClick={handleSort}
			className={cn(
				"-ml-2 h-8 px-2",
				sortState && "text-primary font-semibold",
			)}
		>
			<HeaderCell>
				<span>{label}</span>
				{sortState === "asc" ? (
					<ArrowUpIcon className="ml-1 size-4" />
				) : sortState === "desc" ? (
					<ArrowDownIcon className="ml-1 size-4" />
				) : (
					<ArrowUpDownIcon className="ml-1 size-4 opacity-50" />
				)}
			</HeaderCell>
		</Button>
	);
}
