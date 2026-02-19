import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { AcademicsAnalytics } from "@/components/pages/manage-academics/academics-analytics";
import { academicsQueryOptions } from "@/lib/api/academics-query";

export const Route = createFileRoute("/_auth/_student/kpi/academics/analytics")(
	{
		loader: async ({ context }) => {
			await context.queryClient.ensureQueryData(academicsQueryOptions);
		},
		component: AcademicsAnalyticsPage,
	},
);

function AcademicsAnalyticsPage() {
	return (
		<div className="flex flex-col gap-8 text-foreground">
			<Suspense fallback={<div>Loading Analytics...</div>}>
				<AcademicsAnalytics />
			</Suspense>
		</div>
	);
}
