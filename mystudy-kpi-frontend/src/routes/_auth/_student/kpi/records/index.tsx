import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Suspense } from "react";
import { IntakeTableSkeleton as KpiTableSkeleton } from "@/components/pages/manage-intake/intake-table-skeleton";
import { KpiRecordsTable } from "@/components/pages/manage-kpi-records/kpi-records-table";

export const Route = createFileRoute("/_auth/_student/kpi/records/")({
	component: KpiRecordsIndexPage,
});

function KpiRecordsIndexPage() {
	const { type } = useSearch({ from: "/_auth/_student/kpi/records" });
	const selectedType = type ?? "all";

	return (
		<Suspense fallback={<KpiTableSkeleton />}>
			<KpiRecordsTable
				filterType={selectedType === "all" ? undefined : selectedType}
			/>
		</Suspense>
	);
}
