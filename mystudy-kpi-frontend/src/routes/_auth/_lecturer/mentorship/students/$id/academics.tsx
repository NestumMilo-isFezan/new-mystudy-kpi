import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AcademicsSortedTable } from "@/components/pages/manage-academics/academics-sorted-table";
import { LecturerAcademicActionGroup } from "@/components/pages/manage-academics/lecturer-action-group";
import type { AcademicListSearch } from "@/lib/api/academic-list-params";
import { academicListSearchSchema } from "@/lib/api/academic-list-params";
import { mentorshipStudentAcademicsSortedQueryOptions } from "@/lib/api/mentorship-students-query";
import { mapAcademicSortColumn } from "@/lib/api/sort-mappers";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/students/$id/academics",
)({
	validateSearch: (search) => academicListSearchSchema.parse(search),
	loader: ({ context, params, location }) => {
		const search = academicListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		return context.queryClient.ensureQueryData(
			mentorshipStudentAcademicsSortedQueryOptions(params.id, search),
		);
	},
	component: StudentAcademicsPage,
});

function StudentAcademicsPage() {
	const { id } = Route.useParams();
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
		<div className="space-y-6">
			<AcademicsSortedTable
				ActionGroup={LecturerAcademicActionGroup}
				queryOptions={mentorshipStudentAcademicsSortedQueryOptions(id, params)}
				params={params}
				onSortChange={handleSortChange}
				onFilterChange={handleFilterChange}
			/>
		</div>
	);
}
