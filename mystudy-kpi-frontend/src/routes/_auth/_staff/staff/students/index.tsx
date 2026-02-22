import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { StudentHeader } from "@/components/pages/manage-student/student-header";
import { StudentTable } from "@/components/pages/manage-student/student-table";
import { StudentTableSkeleton } from "@/components/pages/manage-student/student-table-skeleton";
import { allIntakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";
import { paginatedListSearchSchema } from "@/lib/api/list-params";
import { studentsPageQueryOptions } from "@/lib/api/students-query";

export const Route = createFileRoute("/_auth/_staff/staff/students/")({
	validateSearch: (search) => paginatedListSearchSchema.parse(search),
	loader: async ({ context, location }) => {
		const search = paginatedListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		await Promise.all([
			context.queryClient.ensureQueryData(studentsPageQueryOptions(search)),
			context.queryClient.ensureQueryData(allIntakeBatchesQueryOptions),
		]);
	},
	component: ManageStudentPage,
});

function ManageStudentPage() {
	return (
		<div className="flex flex-col gap-8 py-6 text-foreground">
			<StudentHeader />
			<Suspense fallback={<StudentTableSkeleton />}>
				<StudentTable />
			</Suspense>
		</div>
	);
}
