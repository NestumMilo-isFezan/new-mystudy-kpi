import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import type { TableSortConfig } from "@/components/table/core/table-config";
import { useTableContext } from "@/components/table/core/table-control";
import { Button } from "@/components/ui/button";

type SortButtonProps = {
	option: TableSortConfig;
	className?: string;
};

export function SortButton({ option, className }: SortButtonProps) {
	const { activeSortColumnId, activeSortDirection, setSort } =
		useTableContext();

	const isActive = activeSortColumnId === option.columnId;
	const Icon = !isActive
		? ArrowUpDownIcon
		: activeSortDirection === "asc"
			? ArrowUpIcon
			: ArrowDownIcon;

	return (
		<Button
			type="button"
			variant={isActive ? "default" : "outline"}
			className={`flex w-full items-center justify-between ${className}`}
			onClick={() => {
				if (!isActive) {
					setSort(option.columnId, "asc");
				} else if (activeSortDirection === "asc") {
					setSort(option.columnId, "desc");
				} else {
					setSort("", "");
				}
			}}
		>
			{option.label}
			<Icon className="size-4 opacity-50" />
		</Button>
	);
}
