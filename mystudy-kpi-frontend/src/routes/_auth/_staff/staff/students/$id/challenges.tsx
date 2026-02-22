import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChallengesServerTable } from "@/components/pages/manage-challenges/challenges-server-table";
import type { Challenge } from "@/lib/api/challenges.functions";
import type { ChallengeListSearch } from "@/lib/api/challenge-list-params";
import { challengeListSearchSchema } from "@/lib/api/challenge-list-params";
import { mapChallengeSortColumn } from "@/lib/api/sort-mappers";
import { adminStudentChallengesPageQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute(
	"/_auth/_staff/staff/students/$id/challenges",
)({
	validateSearch: (search) => challengeListSearchSchema.parse(search),
	loader: ({ context, params, location }) => {
		const search = challengeListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		return context.queryClient.ensureQueryData(
			adminStudentChallengesPageQueryOptions(params.id, search),
		);
	},
	component: AdminStudentChallengesPage,
});

type ActionGroupProps = {
	record: Challenge;
	variant: "card" | "cell";
};

function StaffChallengeActionGroup(_props: ActionGroupProps) {
	return null;
}

function AdminStudentChallengesPage() {
	const { id } = Route.useParams();
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
		<div className="space-y-6">
			<ChallengesServerTable
				ActionGroup={StaffChallengeActionGroup}
				pageQueryOptions={adminStudentChallengesPageQueryOptions(id, params)}
				pageParams={params}
				onPageChange={handlePageChange}
				onSortChange={handleSortChange}
				onFilterChange={handleFilterChange}
			/>
		</div>
	);
}
