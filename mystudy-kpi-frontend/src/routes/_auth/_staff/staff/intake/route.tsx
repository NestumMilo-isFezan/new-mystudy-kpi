import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_staff/staff/intake")({
	component: () => <Outlet />,
});
