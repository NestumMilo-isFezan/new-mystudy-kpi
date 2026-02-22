import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { LecturerHeader } from "@/components/pages/manage-lecturer/lecturer-header";
import { LecturerTable } from "@/components/pages/manage-lecturer/lecturer-table";
import { LecturerTableSkeleton } from "@/components/pages/manage-lecturer/lecturer-table-skeleton";
import { paginatedListSearchSchema } from "@/lib/api/list-params";
import { lecturersPageQueryOptions } from "@/lib/api/lecturers-query";

export const Route = createFileRoute("/_auth/_staff/staff/manage-lecturers")({
	validateSearch: (search) => paginatedListSearchSchema.parse(search),
	loader: ({ context, location }) => {
		const search = paginatedListSearchSchema.parse(
			Object.fromEntries(new URLSearchParams(location.search)),
		);
		return context.queryClient.ensureQueryData(lecturersPageQueryOptions(search));
	},
	component: ManageLecturerPage,
});

function ManageLecturerPage() {
	return (
		<div className="flex flex-col gap-8 py-6 text-foreground">
			<LecturerHeader />
			<Suspense fallback={<LecturerTableSkeleton />}>
				<LecturerTable />
			</Suspense>
		</div>
	);
}
