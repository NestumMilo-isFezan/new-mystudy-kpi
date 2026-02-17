import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_staff/staff/register-lecturer")({
	component: () => <div>Hello from Register Lecturer</div>,
});
