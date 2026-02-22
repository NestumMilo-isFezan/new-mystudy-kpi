import {
	type ColumnDef,
	type ColumnFiltersState,
	type ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { TableControlConfig } from "@/components/table/core/table-config";
import { useIsMobile } from "@/hooks/use-mobile";
import type { PaginationMeta } from "@/lib/api/server-function-types";

export type ServerPaginationProps = {
	meta: PaginationMeta;
	page: number;
	onPageChange: (page: number) => void;
};

export type ServerControlCallbacks = {
	/** Called when sort column or direction changes. Empty strings mean "clear sort". */
	onSortChange?: (columnId: string, direction: "asc" | "desc" | "") => void;
	/** Called when a filter dropdown value changes. Empty string means "clear filter". */
	onFilterChange?: (columnId: string, value: string) => void;
};

type UseTableControlOptions<TData> = {
	data: TData[];
	columns: ColumnDef<TData, unknown>[];
	config: TableControlConfig;
	isMobile: boolean;
	serverPagination?: ServerPaginationProps;
	serverCallbacks?: ServerControlCallbacks;
	/** Initial column filter state derived from URL search params. Kept in sync on navigation. */
	initialColumnFilters?: ColumnFiltersState;
	/** Initial sorting state derived from URL search params. Kept in sync on navigation. */
	initialSorting?: SortingState;
};

type TableControlState<TData> = ReturnType<typeof useTableControl<TData>>;

const TableControlContext = createContext<
	TableControlState<unknown> | undefined
>(undefined);

export function useTableContext<TData>() {
	const context = useContext(TableControlContext);
	if (!context) {
		throw new Error("useTableContext must be used within a TableControl");
	}
	return context as TableControlState<TData>;
}

function buildDefaultVisibility(config: TableControlConfig): VisibilityState {
	return config.columns.reduce<VisibilityState>((visibility, columnConfig) => {
		visibility[columnConfig.columnId] = !columnConfig.hiddenByDefault;
		return visibility;
	}, {});
}

export function useTableControl<TData>({
	data,
	columns,
	config,
	isMobile,
	serverPagination,
	serverCallbacks,
	initialColumnFilters,
	initialSorting,
}: UseTableControlOptions<TData>) {
	const defaultVisibility = useMemo(
		() => buildDefaultVisibility(config),
		[config],
	);

	const [query, setQuery] = useState("");
	const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
		initialColumnFilters ?? [],
	);
	const [columnVisibility, setColumnVisibility] =
		useState<VisibilityState>(defaultVisibility);
	const [expanded, setExpanded] = useState<ExpandedState>({});

	// Sync filter/sort state when URL-derived initial values change (e.g. back/forward navigation)
	useEffect(() => {
		setColumnFilters(initialColumnFilters ?? []);
	}, [initialColumnFilters]);

	useEffect(() => {
		setSorting(initialSorting ?? []);
	}, [initialSorting]);

	useEffect(() => {
		setColumnVisibility(buildDefaultVisibility(config));
	}, [config]);

	const queryableColumns = isMobile
		? config.query.mobileColumns
		: config.query.desktopColumns;

	const table = useReactTable({
		data,
		columns,
		state: {
			globalFilter: query,
			sorting,
			columnFilters,
			columnVisibility,
			expanded,
		},
		onGlobalFilterChange: setQuery,
		onSortingChange: (updater) => {
			setSorting((current) => {
				const nextSorting =
					typeof updater === "function" ? updater(current) : updater;

				if (nextSorting.length <= 1) {
					return nextSorting;
				}

				return [nextSorting[nextSorting.length - 1]];
			});
		},
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onExpandedChange: setExpanded,
		globalFilterFn: (row, _columnId, filterValueRaw) => {
			const normalizedFilter = String(filterValueRaw ?? "")
				.trim()
				.toLowerCase();

			if (!normalizedFilter) {
				return true;
			}

			return queryableColumns.some((columnId) => {
				const value = row.getValue(columnId);
				if (value === null || value === undefined) {
					return false;
				}

				return String(value).toLowerCase().includes(normalizedFilter);
			});
		},
		filterFns: {
			selectEquals: (row, columnId, value) => {
				if (!value) {
					return true;
				}

				return String(row.getValue(columnId)) === String(value);
			},
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		enableMultiSort: false,
	});

	const activeSort = sorting[0];
	const activeSortColumnId = activeSort?.id ?? "";
	const activeSortDirection = activeSort
		? activeSort.desc
			? "desc"
			: "asc"
		: "";

	const hasActiveQuery = query.trim().length > 0;
	const hasActiveFilter = columnFilters.length > 0;
	const hasActiveSort = sorting.length > 0;

	const hiddenColumnCount = config.columns.reduce((count, columnConfig) => {
		if (columnConfig.hideable === false) {
			return count;
		}

		const defaultVisible = defaultVisibility[columnConfig.columnId] ?? true;
		const currentVisible =
			table.getColumn(columnConfig.columnId)?.getIsVisible() ?? defaultVisible;

		return defaultVisible !== currentVisible ? count + 1 : count;
	}, 0);

	const hasDesktopClear =
		hasActiveQuery || hasActiveFilter || hasActiveSort || hiddenColumnCount > 0;
	const hasMobileClear = hasActiveQuery || hasActiveFilter || hasActiveSort;

	const appliedMobileCount =
		(hasActiveQuery ? 1 : 0) + columnFilters.length + (hasActiveSort ? 1 : 0);

	function setFilterValue(columnId: string, nextValue: string) {
		table
			.getColumn(columnId)
			?.setFilterValue(nextValue.length > 0 ? nextValue : undefined);

		// Notify server callbacks if provided (resets page to 1 externally)
		serverCallbacks?.onFilterChange?.(columnId, nextValue);
	}

	function getFilterValue(columnId: string) {
		return (table.getColumn(columnId)?.getFilterValue() as string) ?? "";
	}

	function setSort(columnId: string, direction: "asc" | "desc" | "") {
		if (!columnId || !direction) {
			setSorting([]);
			// Notify server callbacks to clear sort
			serverCallbacks?.onSortChange?.("", "");
			return;
		}

		setSorting([{ id: columnId, desc: direction === "desc" }]);
		// Notify server callbacks to apply server-side sort
		serverCallbacks?.onSortChange?.(columnId, direction);
	}

	function toggleColumn(columnId: string, visible: boolean) {
		table.getColumn(columnId)?.toggleVisibility(visible);
	}

	function isColumnVisible(columnId: string) {
		return table.getColumn(columnId)?.getIsVisible() ?? true;
	}

	function resetColumnsToDefault() {
		setColumnVisibility(defaultVisibility);
	}

	function clearDesktopControls() {
		setQuery("");
		setColumnFilters([]);
		setSorting([]);
		resetColumnsToDefault();
		// Notify server callbacks to clear sort + filters
		serverCallbacks?.onSortChange?.("", "");
		if (config.filters) {
			for (const filter of config.filters) {
				serverCallbacks?.onFilterChange?.(filter.columnId, "");
			}
		}
	}

	function clearMobileControls() {
		setQuery("");
		setColumnFilters([]);
		setSorting([]);
		serverCallbacks?.onSortChange?.("", "");
		if (config.filters) {
			for (const filter of config.filters) {
				serverCallbacks?.onFilterChange?.(filter.columnId, "");
			}
		}
	}

	const hideableColumns = config.columns.filter((columnConfig) => {
		return columnConfig.hideable !== false;
	});

	return {
		table,
		config,
		query,
		setQuery,
		getFilterValue,
		setFilterValue,
		activeSortColumnId,
		activeSortDirection,
		setSort,
		toggleColumn,
		isColumnVisible,
		hideableColumns,
		hiddenColumnCount,
		hasDesktopClear,
		hasMobileClear,
		appliedMobileCount,
		clearDesktopControls,
		clearMobileControls,
		serverPagination,
	};
}

type TableControlProps<TData> = {
	data: TData[];
	columns: ColumnDef<TData, unknown>[];
	config: TableControlConfig;
	children: ReactNode;
	serverPagination?: ServerPaginationProps;
	serverCallbacks?: ServerControlCallbacks;
	/** Initial column filter state derived from URL search params. Kept in sync on navigation. */
	initialColumnFilters?: ColumnFiltersState;
	/** Initial sorting state derived from URL search params. Kept in sync on navigation. */
	initialSorting?: SortingState;
};

export function TableControl<TData>({
	data,
	columns,
	config,
	children,
	serverPagination,
	serverCallbacks,
	initialColumnFilters,
	initialSorting,
}: TableControlProps<TData>) {
	const isMobile = useIsMobile();
	const controls = useTableControl({
		data,
		columns,
		config,
		isMobile,
		serverPagination,
		serverCallbacks,
		initialColumnFilters,
		initialSorting,
	});

	return (
		<TableControlContext.Provider
			value={controls as TableControlState<unknown>}
		>
			{children}
		</TableControlContext.Provider>
	);
}

