import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { ChallengeHeader } from "@/components/pages/manage-challenges/challenge-header";
import { ChallengesServerTable } from "@/components/pages/manage-challenges/challenges-server-table";
import { IntakeTableSkeleton as ChallengeTableSkeleton } from "@/components/pages/manage-intake/intake-table-skeleton";
import { academicsQueryOptions } from "@/lib/api/academics-query";
import type { ChallengeListSearch } from "@/lib/api/challenge-list-params";
import { challengeListSearchSchema } from "@/lib/api/challenge-list-params";
import { challengesPageQueryOptions } from "@/lib/api/challenges-query";
import { mapChallengeSortColumn } from "@/lib/api/sort-mappers";

export const Route = createFileRoute("/_auth/_student/kpi/challenges")({
	validateSearch: (search) => challengeListSearchSchema.parse(search),
	loader: async ({ context, location }) => {
		const search = challengeListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		await Promise.all([
			context.queryClient.ensureQueryData(challengesPageQueryOptions(search)),
			context.queryClient.ensureQueryData(academicsQueryOptions),
		]);
	},
	component: ManageChallengesPage,
});

function ManageChallengesPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const params = {
		page: search.page ?? 1,
		limit: search.limit ?? 25,
		sortBy: search.sortBy,
		sortDir: search.sortDir,
		semester: search.semester,
	};

	const handlePageChange = (page: number) => {
		navigate({ search: (prev: ChallengeListSearch) => ({ ...prev, page }) });
	};

	const handleSortChange = (
		columnId: string,
		direction: "asc" | "desc" | "",
	) => {
		const sortBy = mapChallengeSortColumn(columnId);
		navigate({
			search: (prev: ChallengeListSearch) => ({
				...prev,
				page: 1,
				sortBy: sortBy && direction ? sortBy : undefined,
				sortDir: direction || undefined,
			}),
		});
	};

	const handleFilterChange = (columnId: string, value: string) => {
		if (columnId !== "semesterNumber") return;
		navigate({
			search: (prev: ChallengeListSearch) => ({
				...prev,
				page: 1,
				semester: value ? Number(value) : undefined,
			}),
		});
	};

	return (
		<div className="flex flex-col gap-8 py-6 text-foreground">
			<ChallengeHeader />

			<Suspense fallback={<ChallengeTableSkeleton />}>
				<ChallengesServerTable
					pageQueryOptions={challengesPageQueryOptions(params)}
					pageParams={params}
					onPageChange={handlePageChange}
					onSortChange={handleSortChange}
					onFilterChange={handleFilterChange}
				/>
			</Suspense>
			<Outlet />
		</div>
	);
}
