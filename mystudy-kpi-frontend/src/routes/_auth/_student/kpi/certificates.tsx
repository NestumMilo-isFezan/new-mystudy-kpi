import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_student/kpi/certificates")({
	component: () => <div>Hello from Certificates</div>,
});
