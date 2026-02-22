import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { MentorshipHeader } from "@/components/pages/mentorship/mentorship-header";
import { MentorshipTable } from "@/components/pages/mentorship/mentorship-table";
import { MentorshipTableSkeleton } from "@/components/pages/mentorship/mentorship-table-skeleton";
import type { MentorshipListSearch } from "@/lib/api/mentorship-list-params";
import { mentorshipListSearchSchema } from "@/lib/api/mentorship-list-params";
import { lecturerMentorshipsPageQueryOptions } from "@/lib/api/mentorships-query";

function mapMentorshipSortColumn(columnId: string): MentorshipListSearch["sortBy"] {
	if (columnId === "intakeBatchName") return "intakeBatchName";
	if (columnId === "startYear") return "startYear";
	if (columnId === "menteeCount") return "menteeCount";
	return undefined;
}

export const Route = createFileRoute("/_auth/_lecturer/mentorship/")({
	validateSearch: (search) => mentorshipListSearchSchema.parse(search),
	loader: ({ context, location }) => {
		const search = mentorshipListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		const params = {
			page: search.page ?? 1,
			limit: search.limit ?? 25,
			sortBy: search.sortBy,
			sortDir: search.sortDir,
			startYear: search.startYear,
			lecturerId: undefined,
		};
		return context.queryClient.ensureQueryData(
			lecturerMentorshipsPageQueryOptions(params),
		);
	},
	component: MentorshipIndex,
});

function MentorshipIndex() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const params = {
		page: search.page ?? 1,
		limit: search.limit ?? 25,
		sortBy: search.sortBy,
		sortDir: search.sortDir,
		startYear: search.startYear,
		lecturerId: undefined,
	};

	const handlePageChange = (page: number) => {
		navigate({ search: (prev: MentorshipListSearch) => ({ ...prev, page }) });
	};

	const handleSortChange = (
		columnId: string,
		direction: "asc" | "desc" | "",
	) => {
		const sortBy = mapMentorshipSortColumn(columnId);
		navigate({
			search: (prev: MentorshipListSearch) => ({
				...prev,
				page: 1,
				sortBy: sortBy && direction ? sortBy : undefined,
				sortDir: direction || undefined,
			}),
		});
	};

	const handleFilterChange = (columnId: string, value: string) => {
		if (columnId !== "startYear") return;
		navigate({
			search: (prev: MentorshipListSearch) => ({
				...prev,
				page: 1,
				startYear: value ? Number(value) : undefined,
			}),
		});
	};

	return (
		<>
			<MentorshipHeader />
			<Suspense fallback={<MentorshipTableSkeleton />}>
				<MentorshipTable
					pageQueryOptions={lecturerMentorshipsPageQueryOptions(params)}
					pageParams={params}
					onPageChange={handlePageChange}
					onSortChange={handleSortChange}
					onFilterChange={handleFilterChange}
				/>
			</Suspense>
		</>
	);
}
