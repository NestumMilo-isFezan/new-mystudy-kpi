import type { Column } from "@tanstack/react-table";
import {
	ArrowDownIcon,
	ArrowUpDownIcon,
	ArrowUpIcon,
	ChevronDownIcon,
	XIcon,
} from "lucide-react";
import { useTableContext } from "@/components/table/core/table-control";
import { HeaderCell } from "@/components/table/header/cell";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterCellProps<TData> = {
	column: Column<TData, unknown>;
	label: string;
};

export function FilterCell<TData>({ column, label }: FilterCellProps<TData>) {
	const { config, getFilterValue, setFilterValue } = useTableContext();

	const filterConfig = config.filters?.find((f) => f.columnId === column.id);

	if (!filterConfig) {
		return <HeaderCell>{label}</HeaderCell>;
	}

	const currentValue = getFilterValue(column.id) || "all";
	const selectedOption = filterConfig.options.find(
		(opt) => opt.value === currentValue,
	);
	const isActive = currentValue !== "all";

	const canSort = column.getCanSort();
	const sortState = column.getIsSorted();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className={`-ml-2 h-8 px-2 ${
							isActive || sortState ? "text-primary" : ""
						}`}
					/>
				}
			>
				<HeaderCell>
					<span>{label}</span>
					{isActive && selectedOption ? (
						<span className="ml-1 text-xs font-normal text-muted-foreground">
							({selectedOption.label})
						</span>
					) : null}
					{canSort &&
						(sortState === "asc" ? (
							<ArrowUpIcon className="ml-1 size-3.5" />
						) : sortState === "desc" ? (
							<ArrowDownIcon className="ml-1 size-3.5" />
						) : (
							<ArrowUpDownIcon className="ml-1 size-3.5 opacity-50" />
						))}
					<ChevronDownIcon className="ml-1 size-3.5 opacity-50" />
				</HeaderCell>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
				{canSort && (
					<>
						<DropdownMenuGroup>
							<DropdownMenuLabel>Sort</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
								<ArrowUpIcon className="mr-2 size-4 opacity-50" />
								Ascending
								{sortState === "asc" && " (active)"}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
								<ArrowDownIcon className="mr-2 size-4 opacity-50" />
								Descending
								{sortState === "desc" && " (active)"}
							</DropdownMenuItem>
							{sortState && (
								<DropdownMenuItem onClick={() => column.clearSorting()}>
									<XIcon className="mr-2 size-4 opacity-50" />
									Clear sorting
								</DropdownMenuItem>
							)}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
					</>
				)}
				<DropdownMenuGroup>
					<DropdownMenuLabel>Filter by {filterConfig.label}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuRadioGroup
						value={currentValue}
						onValueChange={(value) => {
							setFilterValue(column.id, value === "all" ? "" : value);
						}}
					>
						<DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
						{filterConfig.options.map((option) => (
							<DropdownMenuRadioItem key={option.value} value={option.value}>
								{option.label}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
