import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_student/kpi/cgpa")({
	component: () => <div>Hello from CGPA</div>,
});
