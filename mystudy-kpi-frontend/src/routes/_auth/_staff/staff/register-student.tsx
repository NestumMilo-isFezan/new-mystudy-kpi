import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_staff/staff/register-student")({
	component: () => <div>Hello from Register Student</div>,
});
