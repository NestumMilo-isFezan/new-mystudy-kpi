import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { ChallengeHeader } from "@/components/pages/manage-challenges/challenge-header";
import { ChallengeTable } from "@/components/pages/manage-challenges/challenge-table";
import { IntakeTableSkeleton as ChallengeTableSkeleton } from "@/components/pages/manage-intake/intake-table-skeleton";
import { academicsQueryOptions } from "@/lib/api/academics-query";
import { challengesQueryOptions } from "@/lib/api/challenges-query";

export const Route = createFileRoute("/_auth/_student/kpi/challenges")({
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(challengesQueryOptions),
			context.queryClient.ensureQueryData(academicsQueryOptions),
		]);
	},
	component: ManageChallengesPage,
});

function ManageChallengesPage() {
	return (
		<div className="flex flex-col gap-8 py-6 text-foreground">
			<ChallengeHeader />

			<Suspense fallback={<ChallengeTableSkeleton />}>
				<ChallengeTable />
			</Suspense>
			<Outlet />
		</div>
	);
}
