import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_lecturer/mentorship/students")({
	component: () => <Outlet />,
});
