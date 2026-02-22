import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { MentorshipHeader } from "@/components/pages/mentorship/mentorship-header";
import { MentorshipTable } from "@/components/pages/mentorship/mentorship-table";
import { MentorshipTableSkeleton } from "@/components/pages/mentorship/mentorship-table-skeleton";
import type { MentorshipListSearch } from "@/lib/api/mentorship-list-params";
import { mentorshipListSearchSchema } from "@/lib/api/mentorship-list-params";
import { adminMentorshipsPageQueryOptions } from "@/lib/api/mentorships-query";

function mapMentorshipSortColumn(columnId: string): MentorshipListSearch["sortBy"] {
	if (columnId === "intakeBatchName") return "intakeBatchName";
	if (columnId === "startYear") return "startYear";
	if (columnId === "menteeCount") return "menteeCount";
	if (columnId === "lecturer") return "lecturer";
	return undefined;
}

export const Route = createFileRoute("/_auth/_staff/staff/mentorships/")({
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
			lecturerId: search.lecturerId,
		};
		return context.queryClient.ensureQueryData(
			adminMentorshipsPageQueryOptions(params),
		);
	},
	component: AdminMentorshipIndex,
});

function AdminMentorshipIndex() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const params = {
		page: search.page ?? 1,
		limit: search.limit ?? 25,
		sortBy: search.sortBy,
		sortDir: search.sortDir,
		startYear: search.startYear,
		lecturerId: search.lecturerId,
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
		navigate({
			search: (prev: MentorshipListSearch) => ({
				...prev,
				page: 1,
				startYear:
					columnId === "startYear" ? (value ? Number(value) : undefined) : prev.startYear,
				lecturerId:
					columnId === "lecturer" ? (value || undefined) : prev.lecturerId,
			}),
		});
	};

	return (
		<>
			<MentorshipHeader
				title="All Mentorships"
				description="Monitor and manage mentorship pairings across the entire faculty."
				rootPath="/staff/mentorships"
			/>
			<Suspense fallback={<MentorshipTableSkeleton />}>
				<MentorshipTable
					pageQueryOptions={adminMentorshipsPageQueryOptions(params)}
					pageParams={params}
					onPageChange={handlePageChange}
					onSortChange={handleSortChange}
					onFilterChange={handleFilterChange}
					showLecturer={true}
					rootPath="/staff/mentorships"
				/>
			</Suspense>
		</>
	);
}
