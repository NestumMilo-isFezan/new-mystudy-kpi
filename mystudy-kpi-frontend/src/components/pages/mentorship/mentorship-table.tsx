import {
	type UseSuspenseQueryOptions,
	useQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import type { LinkProps } from "@tanstack/react-router";
import { LayoutPanelLeft, Users } from "lucide-react";
import { useMemo } from "react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { MenteeSubTable } from "@/components/pages/mentorship/mentee-sub-table";
import { MentorshipCard } from "@/components/pages/mentorship/mentorship-card";
import { getMentorshipTableColumns } from "@/components/pages/mentorship/mentorship-table-columns";
import { getMentorshipTableControlConfig } from "@/components/pages/mentorship/mentorship-table-control";
import { CoreExpandableTable } from "@/components/table/core/expandable-table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TablePagination } from "@/components/table/core/table-pagination";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { allLecturersQueryOptions } from "@/lib/api/lecturers-query";
import type {
	MentorshipListSearch,
	SortableMentorshipColumn,
} from "@/lib/api/mentorship-list-params";
import type { Mentorship } from "@/lib/api/mentorships.functions";
import type { PaginatedResponse } from "@/lib/api/server-function-types";

type MentorshipTableProps = {
	pageQueryOptions: unknown;
	pageParams: MentorshipListSearch;
	onPageChange: (page: number) => void;
	onSortChange: (columnId: string, direction: "asc" | "desc" | "") => void;
	onFilterChange: (columnId: string, value: string) => void;
	showLecturer?: boolean;
	rootPath?: LinkProps["to"];
};

function mapSortableToColumn(sortBy?: SortableMentorshipColumn): string | undefined {
	if (!sortBy) return undefined;
	return sortBy;
}

export function MentorshipTable({
	pageQueryOptions,
	pageParams,
	onPageChange,
	onSortChange,
	onFilterChange,
	showLecturer = false,
	rootPath = "/mentorship",
}: MentorshipTableProps) {
	const { data: pageData } = useSuspenseQuery(
		pageQueryOptions as UseSuspenseQueryOptions<PaginatedResponse<Mentorship>>,
	);
	const mentorships = pageData.items;
	const { data: allLecturers = [] } = useQuery({
		...allLecturersQueryOptions,
		enabled: showLecturer,
	});

	const totalMenteesOnPage = mentorships.reduce(
		(sum, item) => sum + item.menteeCount,
		0,
	);

	const columns = useMemo(
		() => getMentorshipTableColumns(showLecturer, rootPath),
		[showLecturer, rootPath],
	);
	const config = useMemo(
		() =>
			getMentorshipTableControlConfig(mentorships, showLecturer, allLecturers),
		[mentorships, showLecturer, allLecturers],
	);

	const initialColumnFilters = useMemo<ColumnFiltersState>(() => {
		const filters: ColumnFiltersState = [];
		if (pageParams.startYear != null) {
			filters.push({ id: "startYear", value: String(pageParams.startYear) });
		}
		if (showLecturer && pageParams.lecturerId) {
			filters.push({ id: "lecturer", value: pageParams.lecturerId });
		}
		return filters;
	}, [pageParams.startYear, pageParams.lecturerId, showLecturer]);

	const initialSorting = useMemo<SortingState>(() => {
		if (!pageParams.sortBy || !pageParams.sortDir) return [];
		const columnId = mapSortableToColumn(pageParams.sortBy);
		if (!columnId) return [];
		return [{ id: columnId, desc: pageParams.sortDir === "desc" }];
	}, [pageParams.sortBy, pageParams.sortDir]);

	if (pageData.pagination.total === 0) {
		return (
			<div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground shadow-sm">
				<Users className="mx-auto mb-3 h-9 w-9 opacity-30" />
				<p className="font-medium text-foreground">No mentorship records yet</p>
				<p className="mt-1 text-sm text-muted-foreground">
					Assign students to start building your mentorship groups.
				</p>
			</div>
		);
	}

	return (
		<TableControl
			data={mentorships}
			columns={columns}
			config={config}
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
			<div className="space-y-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<SummaryCard
						title="Mentorship Batches"
						value={pageData.pagination.total}
						description="Total intake batches in this result set."
						icon={LayoutPanelLeft}
					/>
					<SummaryCard
						title="Mentees (Current Page)"
						value={totalMenteesOnPage}
						description="Combined students for the current page."
						icon={Users}
					/>
				</div>

				<TableToolbar />

				<div className="hidden md:block">
					<CoreExpandableTable<Mentorship>
						renderSubComponent={({ row }) => (
							<MenteeSubTable mentorship={row.original} rootPath={rootPath} />
						)}
					/>
				</div>

				<MentorshipMobileList rootPath={rootPath} />

				<TablePagination />
			</div>
		</TableControl>
	);
}

function MentorshipMobileList({ rootPath }: { rootPath: LinkProps["to"] }) {
	const { table } = useTableContext<Mentorship>();
	const currentRows = table.getRowModel().rows;
	const totalMentees = currentRows.reduce(
		(sum, row) => sum + row.original.menteeCount,
		0,
	);

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.map((row) => (
				<MentorshipCard
					key={row.id}
					mentorship={row.original}
					rootPath={rootPath}
				/>
			))}
			{currentRows.length > 0 && (
				<div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
					<span className="font-bold">Total Mentees</span>
					<Badge variant="outline" className="font-mono">
						{totalMentees}
					</Badge>
				</div>
			)}
		</div>
	);
}
