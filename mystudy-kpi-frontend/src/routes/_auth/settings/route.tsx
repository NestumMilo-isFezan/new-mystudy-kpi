import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import SettingsLayout from "@/components/layouts/settings-layout";

export const Route = createFileRoute("/_auth/settings")({
	beforeLoad: ({ location }) => {
		if (location.pathname === "/settings") {
			throw redirect({
				to: "/settings/profile",
				replace: true,
			});
		}
	},
	component: () => (
		<SettingsLayout>
			<Outlet />
		</SettingsLayout>
	),
});
