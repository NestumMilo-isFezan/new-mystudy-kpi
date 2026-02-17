import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_student/kpi/curricular")({
	component: () => <div>Hello from Curricular</div>,
});
