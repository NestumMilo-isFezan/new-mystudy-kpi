import {
	createFileRoute,
	Link,
	Outlet,
	useRouter,
} from "@tanstack/react-router";

import AuthLayout from "@/components/layouts/auth-layout";
import { requireAuth } from "@/lib/auth/route-guards";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ context }) => {
		const session = await requireAuth(context.queryClient);

		return { session };
	},
	errorComponent: AuthSessionErrorComponent,
	component: AuthGroupLayout,
});

function isSessionOutageError(error: unknown): boolean {
	return error instanceof Error && error.message === "Unable to load session.";
}

function AuthSessionErrorComponent({ error }: { error: unknown }) {
	const router = useRouter();
	const isOutage = isSessionOutageError(error);

	return (
		<main className="bg-muted flex min-h-svh items-center justify-center p-6">
			<section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 shadow-sm">
				<h2 className="text-2xl font-semibold text-foreground">
					{isOutage ? "Service temporarily unavailable" : "Unable to load page"}
				</h2>
				<p className="mt-3 text-sm text-muted-foreground">
					{isOutage
						? "We could not verify your session because the server is temporarily unreachable."
						: "An unexpected error occurred while loading this page."}
				</p>
				<div className="mt-6 flex flex-wrap gap-3">
					<button
						type="button"
						onClick={() => router.invalidate()}
						className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Retry
					</button>
					<Link
						to="/"
						className="inline-flex items-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						Back to home
					</Link>
				</div>
			</section>
		</main>
	);
}

function AuthGroupLayout() {
	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
}
