import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireRole } from "@/lib/auth/route-guards";

export const Route = createFileRoute("/_auth/_student")({
	beforeLoad: async ({ context }) => {
		await requireRole(context.queryClient, ["student", "lecturer", "staff"]);
	},
	component: () => <Outlet />,
});
