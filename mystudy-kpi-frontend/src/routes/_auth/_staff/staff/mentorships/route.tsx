import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_staff/staff/mentorships")({
	component: () => (
		<div className="mx-auto max-w-7xl animate-in fade-in duration-500 space-y-8 px-4 py-8 md:px-6">
			<Outlet />
		</div>
	),
});
