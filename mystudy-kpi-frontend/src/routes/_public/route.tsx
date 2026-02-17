import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { requireGuest } from "@/lib/auth/route-guards";

export const Route = createFileRoute("/_public")({
	beforeLoad: ({ context }) => requireGuest(context.queryClient),
	component: PublicGroupLayout,
});

function PublicGroupLayout() {
	return (
		<div className="relative min-h-svh">
			<Link
				to="/"
				className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				Back to Home
			</Link>
			<Outlet />
		</div>
	);
}
