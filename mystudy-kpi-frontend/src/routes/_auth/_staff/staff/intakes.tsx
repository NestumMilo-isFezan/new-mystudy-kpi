import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Suspense } from "react";
import { IntakeHeader } from "@/components/pages/manage-intake/intake-header";
import { IntakeTable } from "@/components/pages/manage-intake/intake-table";
import { IntakeTableSkeleton } from "@/components/pages/manage-intake/intake-table-skeleton";
import { Button } from "@/components/ui/button";
import { allIntakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";

export const Route = createFileRoute("/_auth/_staff/staff/intakes")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(allIntakeBatchesQueryOptions);
	},
	errorComponent: IntakesErrorComponent,
	component: ManageIntakePage,
});

function IntakesErrorComponent({ error }: { error: unknown }) {
	const router = useRouter();

	return (
		<div className="py-6">
			<div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 shadow-sm">
				<h2 className="text-lg font-semibold text-destructive">
					Unable to load intakes
				</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					{error instanceof Error
						? error.message
						: "An unexpected error occurred."}
				</p>
				<div className="mt-6">
					<Button onClick={() => router.invalidate()} variant="destructive">
						Try Again
					</Button>
				</div>
			</div>
		</div>
	);
}

function ManageIntakePage() {
	return (
		<div className="flex flex-col gap-8 py-6 text-foreground">
			<IntakeHeader />
			<Suspense fallback={<IntakeTableSkeleton />}>
				<IntakeTable />
			</Suspense>
		</div>
	);
}
