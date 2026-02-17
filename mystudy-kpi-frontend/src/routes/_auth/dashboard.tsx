import { createFileRoute } from "@tanstack/react-router";

import { useAuth } from "@/lib/auth/auth-context";
import { mapRole } from "@/lib/auth/role-map";

export const Route = createFileRoute("/_auth/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const { session } = useAuth();

	if (!session) {
		return null;
	}

	return (
		<div className="py-6 text-foreground">
			<section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
				<p className="text-sm uppercase tracking-[0.18em] text-primary">
					Dashboard
				</p>
				<h2 className="mt-2 text-3xl font-semibold">
					Welcome, {session.user.identifier}
				</h2>
				<p className="mt-2 text-muted-foreground">
					You are logged in as{" "}
					<span className="font-semibold">{mapRole(session.user.role)}</span>.
				</p>

				<div className="mt-8 grid gap-4 md:grid-cols-2">
					<article className="rounded-xl border border-border bg-background p-5">
						<h3 className="text-lg font-semibold">Account</h3>
						<p className="mt-3 text-sm text-muted-foreground">
							Identifier: {session.user.identifier}
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							Email: {session.user.email}
						</p>
					</article>

					<article className="rounded-xl border border-border bg-background p-5">
						<h3 className="text-lg font-semibold">Profile status</h3>
						<p className="mt-3 text-sm text-muted-foreground">
							{session.profile
								? `${session.profile.firstName} ${session.profile.lastName}`
								: "Profile not completed yet."}
						</p>
					</article>
				</div>
			</section>
		</div>
	);
}
