import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AcademicsSortedTable } from "@/components/pages/manage-academics/academics-sorted-table";
import type { AcademicRecord } from "@/lib/api/academics.functions";
import type { AcademicListSearch } from "@/lib/api/academic-list-params";
import { academicListSearchSchema } from "@/lib/api/academic-list-params";
import { mapAcademicSortColumn } from "@/lib/api/sort-mappers";
import { adminStudentAcademicsSortedQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute(
	"/_auth/_staff/staff/students/$id/academics",
)({
	validateSearch: (search) => academicListSearchSchema.parse(search),
	loader: ({ context, params, location }) => {
		const search = academicListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		return context.queryClient.ensureQueryData(
			adminStudentAcademicsSortedQueryOptions(params.id, search),
		);
	},
	component: AdminStudentAcademicsPage,
});

type ActionGroupProps = {
	record: AcademicRecord;
	variant: "card" | "cell";
};

/**
 * Empty action group for staff.
 * Staff can view but not edit individual student GPA records from this view.
 */
function StaffAcademicActionGroup(_props: ActionGroupProps) {
	return null;
}

function AdminStudentAcademicsPage() {
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
				ActionGroup={StaffAcademicActionGroup}
				queryOptions={adminStudentAcademicsSortedQueryOptions(id, params)}
				params={params}
				onSortChange={handleSortChange}
				onFilterChange={handleFilterChange}
			/>
		</div>
	);
}
