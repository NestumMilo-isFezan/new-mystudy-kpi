import { useTableContext } from "@/components/table/core/table-control";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ColumnDropdown() {
	const { hideableColumns, isColumnVisible, toggleColumn, hiddenColumnCount } =
		useTableContext();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button type="button" variant="outline" />}>
				Columns
				{hiddenColumnCount > 0 ? ` (${hiddenColumnCount} hidden)` : ""}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{hideableColumns.map((columnConfig) => (
						<DropdownMenuCheckboxItem
							key={columnConfig.columnId}
							checked={isColumnVisible(columnConfig.columnId)}
							onCheckedChange={(checked) => {
								toggleColumn(columnConfig.columnId, Boolean(checked));
							}}
						>
							{columnConfig.label}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
