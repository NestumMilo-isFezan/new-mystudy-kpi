import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { AcademicsTable } from "@/components/pages/manage-academics/academics-table";
import { IntakeTableSkeleton as AcademicsTableSkeleton } from "@/components/pages/manage-intake/intake-table-skeleton";

export const Route = createFileRoute("/_auth/_student/kpi/academics/")({
	component: AcademicsIndexPage,
});

function AcademicsIndexPage() {
	return (
		<Suspense fallback={<AcademicsTableSkeleton />}>
			<AcademicsTable />
		</Suspense>
	);
}
