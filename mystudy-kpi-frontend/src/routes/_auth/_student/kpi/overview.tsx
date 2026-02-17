import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_student/kpi/overview")({
	component: () => <div>Hello from Overview</div>,
});
