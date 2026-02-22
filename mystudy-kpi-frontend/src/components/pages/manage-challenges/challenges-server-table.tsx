import {
	type UseSuspenseQueryOptions,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { ColumnFiltersState, Row, SortingState } from "@tanstack/react-table";
import { type ComponentType, useMemo } from "react";
import { ChallengeActionGroup } from "@/components/pages/manage-challenges/challenge-action-group";
import { ChallengeCard } from "@/components/pages/manage-challenges/challenge-card";
import { getChallengeTableColumns } from "@/components/pages/manage-challenges/challenge-table-columns";
import { challengeTableControlConfig } from "@/components/pages/manage-challenges/challenge-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TablePagination } from "@/components/table/core/table-pagination";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import type { ChallengeListSearch } from "@/lib/api/challenge-list-params";
import type { Challenge } from "@/lib/api/challenges.functions";
import type { PaginatedResponse } from "@/lib/api/server-function-types";

type ActionGroupProps = {
	record: Challenge;
	variant: "card" | "cell";
};

type ChallengesServerTableProps = {
	pageQueryOptions: unknown;
	pageParams: ChallengeListSearch;
	onPageChange: (page: number) => void;
	onSortChange: (columnId: string, direction: "asc" | "desc" | "") => void;
	onFilterChange: (columnId: string, value: string) => void;
	ActionGroup?: ComponentType<ActionGroupProps>;
};

export function ChallengesServerTable({
	pageQueryOptions,
	pageParams,
	onPageChange,
	onSortChange,
	onFilterChange,
	ActionGroup = (props) => (
		<ChallengeActionGroup challenge={props.record} variant={props.variant} />
	),
}: ChallengesServerTableProps) {
	const { data: pageData } = useSuspenseQuery(
		pageQueryOptions as UseSuspenseQueryOptions<PaginatedResponse<Challenge>>,
	);

	const columns = useMemo(
		() => getChallengeTableColumns(ActionGroup),
		[ActionGroup],
	);

	const initialColumnFilters = useMemo<ColumnFiltersState>(() => {
		const filters: ColumnFiltersState = [];
		if (pageParams.semester != null) {
			filters.push({ id: "semesterNumber", value: String(pageParams.semester) });
		}
		return filters;
	}, [pageParams.semester]);

	const initialSorting = useMemo<SortingState>(() => {
		if (!pageParams.sortBy || !pageParams.sortDir) return [];
		return [{ id: pageParams.sortBy, desc: pageParams.sortDir === "desc" }];
	}, [pageParams.sortBy, pageParams.sortDir]);

	return (
		<TableControl
			data={pageData.items}
			columns={columns}
			config={challengeTableControlConfig}
			serverPagination={{
				meta: pageData.pagination,
				page: pageParams.page,
				onPageChange,
			}}
			serverCallbacks={{
				onSortChange,
				onFilterChange,
			}}
			initialColumnFilters={initialColumnFilters}
			initialSorting={initialSorting}
		>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No challenges match your filters." />
				</div>

				<ChallengeMobileList ActionGroup={ActionGroup} />

				<TablePagination />
			</div>
		</TableControl>
	);
}

function ChallengeMobileList({
	ActionGroup,
}: {
	ActionGroup: ComponentType<ActionGroupProps>;
}) {
	const { table } = useTableContext<Challenge>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<Challenge>) => (
					<ChallengeCard
						key={row.id}
						challenge={row.original}
						ActionGroup={ActionGroup}
					/>
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No challenges match your filters.
				</div>
			)}
		</div>
	);
}
