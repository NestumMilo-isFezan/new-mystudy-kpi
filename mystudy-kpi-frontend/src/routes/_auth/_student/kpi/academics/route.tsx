import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { AcademicsHeader } from "@/components/pages/manage-academics/academics-header";
import { Button } from "@/components/ui/button";
import { academicsQueryOptions } from "@/lib/api/academics-query";
import { intakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";

export const Route = createFileRoute("/_auth/_student/kpi/academics")({
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(academicsQueryOptions),
			context.queryClient.ensureQueryData(intakeBatchesQueryOptions),
		]);
	},
	errorComponent: AcademicsErrorComponent,
	component: ManageAcademicsPage,
});

function AcademicsErrorComponent({ error }: { error: unknown }) {
	const router = useRouter();

	return (
		<div className="py-6">
			<div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 shadow-sm">
				<h2 className="text-lg font-semibold text-destructive">
					Unable to load academic records
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

function ManageAcademicsPage() {
	return (
		<div className="flex flex-col gap-8 py-6 text-foreground">
			<AcademicsHeader />
			<Outlet />
		</div>
	);
}
