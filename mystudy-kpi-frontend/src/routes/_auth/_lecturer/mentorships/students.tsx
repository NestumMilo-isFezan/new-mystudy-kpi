import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_lecturer/mentorships/students")({
	component: () => <div>Hello from Manage Students</div>,
});
