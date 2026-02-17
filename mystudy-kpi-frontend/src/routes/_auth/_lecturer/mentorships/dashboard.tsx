import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_lecturer/mentorships/dashboard")({
	component: () => <div>Hello from Mentorship Dashboard</div>,
});
