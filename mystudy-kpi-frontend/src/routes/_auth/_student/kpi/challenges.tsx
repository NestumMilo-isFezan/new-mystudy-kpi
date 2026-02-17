import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_student/kpi/challenges")({
	component: () => <div>Hello from Challenges</div>,
});
