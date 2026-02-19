/* biome-ignore-all lint/correctness/noUnusedVariables: Module augmentation requires original type parameter names */
import type { FilterFn } from "@tanstack/react-table";

export type TableColumnMeta = {
	sticky?: "left" | "right";
	isAction?: boolean;
	align?: "start" | "center" | "end";
	hideable?: boolean;
	desktopHidden?: boolean;
	mobileHidden?: boolean;
};

export type TableControlOption = {
	label: string;
	value: string;
};

export type TableQueryConfig = {
	placeholder: string;
	desktopColumns: string[];
	mobileColumns: string[];
};

export type TableFilterConfig = {
	columnId: string;
	label: string;
	placeholder: string;
	options: TableControlOption[];
};

export type TableSortConfig = {
	columnId: string;
	label: string;
};

export type TableColumnVisibilityConfig = {
	columnId: string;
	label: string;
	hideable?: boolean;
	hiddenByDefault?: boolean;
};

export type TableControlConfig = {
	query: TableQueryConfig;
	filters?: TableFilterConfig[];
	sortOptions: TableSortConfig[];
	columns: TableColumnVisibilityConfig[];
};

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData, TValue> extends TableColumnMeta {}

	interface FilterFns {
		selectEquals: FilterFn<unknown>;
	}
}
