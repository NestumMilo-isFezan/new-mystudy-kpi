import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireRole } from "@/lib/auth/route-guards";

export const Route = createFileRoute("/_auth/_lecturer")({
	beforeLoad: async ({ context }) => {
		await requireRole(context.queryClient, ["lecturer", "staff"]);
	},
	component: () => <Outlet />,
});
