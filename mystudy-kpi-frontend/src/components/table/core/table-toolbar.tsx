import { SlidersHorizontalIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useTableContext } from "@/components/table/core/table-control";
import { ColumnDropdown } from "@/components/table/toolbar/column-dropdown";
import { FilterDropdown } from "@/components/table/toolbar/filter-dropdown";
import { InputQuery } from "@/components/table/toolbar/input-query";
import { SortButton } from "@/components/table/toolbar/sort-button";
import { Button } from "@/components/ui/button";

export function TableToolbar() {
	const {
		config,
		hasDesktopClear,
		hasMobileClear,
		appliedMobileCount,
		clearDesktopControls,
		clearMobileControls,
	} = useTableContext();

	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

	return (
		<>
			<div className="flex flex-col gap-3 md:hidden">
				<InputQuery />

				{isMobileFiltersOpen ? (
					<div className="space-y-4 rounded-xl border border-border bg-card p-3">
						{config.filters && config.filters.length > 0 && (
							<div className="space-y-3">
								<p className="text-muted-foreground text-sm font-medium">
									Filters
								</p>
								<div className="grid grid-cols-2 gap-3">
									{config.filters.map((filter, index, filters) => {
										const isLast = index === filters.length - 1;
										const isOdd = filters.length % 2 !== 0;

										return (
											<FilterDropdown
												key={filter.columnId}
												filter={filter}
												className={isLast && isOdd ? "col-span-2" : ""}
											/>
										);
									})}
								</div>
							</div>
						)}

						<div className="space-y-3">
							<p className="text-muted-foreground text-sm font-medium">Sort</p>
							<div className="grid grid-cols-2 gap-2">
								{config.sortOptions.map((option, index, options) => {
									const isLast = index === options.length - 1;
									const isOdd = options.length % 2 !== 0;

									return (
										<SortButton
											key={option.columnId}
											option={option}
											className={isLast && isOdd ? "col-span-2" : ""}
										/>
									);
								})}
							</div>
						</div>

						<div className="flex flex-col gap-2 pt-2">
							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={() => setIsMobileFiltersOpen(false)}
							>
								Hide Filters
							</Button>
							{hasMobileClear ? (
								<Button
									type="button"
									variant="destructive"
									className="w-full"
									onClick={clearMobileControls}
								>
									<XIcon className="size-4" />
									Clear Filters
								</Button>
							) : null}
						</div>
					</div>
				) : (
					<Button
						type="button"
						variant="outline"
						onClick={() => setIsMobileFiltersOpen(true)}
					>
						<SlidersHorizontalIcon className="size-4" />
						Show Filters (Applied {appliedMobileCount})
					</Button>
				)}
			</div>

			<div className="hidden md:flex md:flex-wrap md:items-center md:gap-3">
				<InputQuery className="min-w-[320px] flex-1" />

				{config.filters?.map((filter) => (
					<FilterDropdown
						key={filter.columnId}
						filter={filter}
						className="min-w-35"
					/>
				))}

				<ColumnDropdown />

				{hasDesktopClear ? (
					<Button
						type="button"
						variant="destructive"
						onClick={clearDesktopControls}
					>
						<XIcon className="size-4" />
						Clear
					</Button>
				) : null}
			</div>
		</>
	);
}
