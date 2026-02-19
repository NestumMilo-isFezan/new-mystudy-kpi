import { useSuspenseQuery } from "@tanstack/react-query";
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
import { TableToolbar } from "@/components/table/core/table-toolbar";
import { Badge } from "@/components/ui/badge";
import type { Mentorship } from "@/lib/api/mentorships.functions";
import { lecturerMentorshipsQueryOptions } from "@/lib/api/mentorships-query";

export function MentorshipTable() {
	const { data: mentorships } = useSuspenseQuery(
		lecturerMentorshipsQueryOptions,
	);
	const totalMentees = mentorships.reduce(
		(sum, item) => sum + item.menteeCount,
		0,
	);

	const columns = useMemo(() => getMentorshipTableColumns(), []);
	const config = useMemo(
		() => getMentorshipTableControlConfig(mentorships),
		[mentorships],
	);

	if (mentorships.length === 0) {
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
		<TableControl data={mentorships} columns={columns} config={config}>
			<div className="space-y-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<SummaryCard
						title="Mentorship Batches"
						value={mentorships.length}
						description="Total intake batches you are mentoring."
						icon={LayoutPanelLeft}
					/>
					<SummaryCard
						title="Total Assigned Mentees"
						value={totalMentees}
						description="Combined students across all batches."
						icon={Users}
					/>
				</div>

				<TableToolbar />

				<div className="hidden md:block">
					<CoreExpandableTable<Mentorship>
						renderSubComponent={({ row }) => (
							<MenteeSubTable mentorship={row.original} />
						)}
					/>
				</div>

				<MentorshipMobileList />
			</div>
		</TableControl>
	);
}

function MentorshipMobileList() {
	const { table } = useTableContext<Mentorship>();
	const currentRows = table.getRowModel().rows;
	const totalMentees = currentRows.reduce(
		(sum, row) => sum + row.original.menteeCount,
		0,
	);

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.map((row) => (
				<MentorshipCard key={row.id} mentorship={row.original} />
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
