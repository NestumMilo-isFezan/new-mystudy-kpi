import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { AcademicsSortedTable } from "@/components/pages/manage-academics/academics-sorted-table";
import { IntakeTableSkeleton as AcademicsTableSkeleton } from "@/components/pages/manage-intake/intake-table-skeleton";
import type { AcademicListSearch } from "@/lib/api/academic-list-params";
import { academicListSearchSchema } from "@/lib/api/academic-list-params";
import { academicsSortedQueryOptions } from "@/lib/api/academics-query";
import { mapAcademicSortColumn } from "@/lib/api/sort-mappers";

export const Route = createFileRoute("/_auth/_student/kpi/academics/")({
	validateSearch: (search) => academicListSearchSchema.parse(search),
	loader: ({ context, location }) => {
		const search = academicListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		return context.queryClient.ensureQueryData(academicsSortedQueryOptions(search));
	},
	component: AcademicsIndexPage,
});

function AcademicsIndexPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const params = {
		sortBy: search.sortBy,
		sortDir: search.sortDir,
		semester: search.semester,
	};

	const handleSortChange = (
		columnId: string,
		direction: "asc" | "desc" | "",
	) => {
		const sortBy = mapAcademicSortColumn(columnId);
		navigate({
			search: (prev: AcademicListSearch) => ({
				...prev,
				sortBy: sortBy && direction ? sortBy : undefined,
				sortDir: direction || undefined,
			}),
		});
	};

	const handleFilterChange = (columnId: string, value: string) => {
		if (columnId !== "semester") return;
		navigate({
			search: (prev: AcademicListSearch) => ({
				...prev,
				semester: value ? Number(value) : undefined,
			}),
		});
	};

	return (
		<Suspense fallback={<AcademicsTableSkeleton />}>
			<AcademicsSortedTable
				queryOptions={academicsSortedQueryOptions(params)}
				params={params}
				onSortChange={handleSortChange}
				onFilterChange={handleFilterChange}
			/>
		</Suspense>
	);
}
