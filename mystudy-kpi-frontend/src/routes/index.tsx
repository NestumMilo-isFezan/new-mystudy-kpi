import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpen,
	GraduationCap,
	Layers,
	Shield,
	UserRound,
} from "lucide-react";
export const Route = createFileRoute("/")({ component: App });

function App() {
	const highlights = [
		{
			icon: <GraduationCap className="h-10 w-10 text-primary" />,
			title: "Student Progress Clarity",
			description:
				"Track intake and profile information in one place so every student starts with a complete, consistent record.",
		},
		{
			icon: <UserRound className="h-10 w-10 text-primary" />,
			title: "Role-Based Access",
			description:
				"Keep staff, lecturers, and students focused on the tools they need with JWT-backed permissions.",
		},
		{
			icon: <Layers className="h-10 w-10 text-primary" />,
			title: "Unified KPI Workflow",
			description:
				"Connect intake data, account setup, and profile updates to streamline KPI reporting and academic operations.",
		},
	];

	const modules = [
		{
			icon: <BookOpen className="h-5 w-5" />,
			title: "Intake Batch Management",
		},
		{
			icon: <Shield className="h-5 w-5" />,
			title: "Secure Authentication",
		},
		{
			icon: <UserRound className="h-5 w-5" />,
			title: "Student Profile Module",
		},
	];

	return (
		<div className="min-h-screen bg-background text-foreground">
			<section className="px-6 py-20">
				<div className="mx-auto max-w-6xl">
					<p className="mb-4 inline-flex rounded-full border border-border bg-muted px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
						MyStudy KPI Platform
					</p>

					<h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
						Manage student intake, profiles, and KPI readiness in one secure
						portal.
					</h1>

					<p className="mt-6 max-w-3xl text-base text-muted-foreground md:text-lg">
						This workspace is built for higher-education teams to coordinate
						student records from registration to academic reporting without
						fragmented tools.
					</p>

					<div className="mt-8 flex flex-wrap gap-3">
						<Link
							to="/register"
							className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Create Account
							<ArrowRight className="h-4 w-4" />
						</Link>
						<Link
							to="/login"
							className="inline-flex items-center rounded-lg border border-input bg-background px-5 py-3 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							Sign In
						</Link>
					</div>

					<div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
						{modules.map((module) => (
							<div
								key={module.title}
								className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
							>
								<div className="rounded-md bg-primary/10 p-2 text-primary">
									{module.icon}
								</div>
								<p className="text-sm font-medium">{module.title}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 pb-16">
				<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
					{highlights.map((highlight) => (
						<article
							key={highlight.title}
							className="rounded-2xl border border-border bg-card p-6 shadow-sm"
						>
							<div className="mb-4">{highlight.icon}</div>
							<h2 className="mb-2 text-xl font-semibold">{highlight.title}</h2>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{highlight.description}
							</p>
						</article>
					))}
				</div>
			</section>

			<section className="border-t border-border px-6 py-10">
				<div className="mx-auto max-w-6xl text-sm text-muted-foreground">
					Current backend endpoints: <code>/api/register</code>,{" "}
					<code>/api/login</code>, <code>/api/profile</code>,{" "}
					<code>/api/admin/users</code>
					<p className="mt-2 text-muted-foreground/80">
						Build this page in <code>src/routes/index.tsx</code> as product
						modules are integrated.
					</p>
				</div>
			</section>
		</div>
	);
}
