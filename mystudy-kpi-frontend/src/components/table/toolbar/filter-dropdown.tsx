import { ChevronDownIcon } from "lucide-react";
import type { TableFilterConfig } from "@/components/table/core/table-config";
import { useTableContext } from "@/components/table/core/table-control";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterDropdownProps = {
	filter: TableFilterConfig;
	className?: string;
};

export function FilterDropdown({ filter, className }: FilterDropdownProps) {
	const { getFilterValue, setFilterValue } = useTableContext();
	const currentValue = getFilterValue(filter.columnId) || "all";
	const selectedOption = filter.options.find(
		(opt) => opt.value === currentValue,
	);
	const displayValue = selectedOption ? selectedOption.label : "All";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						type="button"
						variant="outline"
						className={`justify-between px-3 ${className}`}
					/>
				}
			>
				<span className="flex items-center gap-1">
					<span className="text-muted-foreground">{filter.label}:</span>
					<span>{displayValue}</span>
				</span>
				<ChevronDownIcon className="size-4 opacity-50" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuRadioGroup
						value={currentValue}
						onValueChange={(value) => {
							setFilterValue(filter.columnId, value === "all" ? "" : value);
						}}
					>
						<DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
						{filter.options.map((option) => (
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
