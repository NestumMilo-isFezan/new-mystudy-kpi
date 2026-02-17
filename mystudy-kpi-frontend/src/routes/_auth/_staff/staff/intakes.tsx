import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_staff/staff/intakes")({
	component: () => <div>Hello from Manage Intakes</div>,
});
