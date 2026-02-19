import { useSuspenseQuery } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { useMemo } from "react";
import { ChallengeCard } from "@/components/pages/manage-challenges/challenge-card";
import { getChallengeTableColumns } from "@/components/pages/manage-challenges/challenge-table-columns";
import { challengeTableControlConfig } from "@/components/pages/manage-challenges/challenge-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import type { Challenge } from "@/lib/api/challenges.functions";
import { challengesQueryOptions } from "@/lib/api/challenges-query";

export function ChallengeTable() {
	const { data: challenges } = useSuspenseQuery(challengesQueryOptions);

	const columns = useMemo(() => getChallengeTableColumns(), []);

	return (
		<TableControl
			data={challenges}
			columns={columns}
			config={challengeTableControlConfig}
		>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No challenges match your filters." />
				</div>

				<ChallengeMobileList />
			</div>
		</TableControl>
	);
}

function ChallengeMobileList() {
	const { table } = useTableContext<Challenge>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<Challenge>) => (
					<ChallengeCard key={row.id} challenge={row.original} />
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No challenges match your filters.
				</div>
			)}
		</div>
	);
}
