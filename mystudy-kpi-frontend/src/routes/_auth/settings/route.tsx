import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import SettingsLayout from "@/components/layouts/settings-layout";

function normalizePathname(pathname: string) {
	if (pathname.length > 1 && pathname.endsWith("/")) {
		return pathname.slice(0, -1);
	}

	return pathname;
}

export const Route = createFileRoute("/_auth/settings")({
	beforeLoad: ({ location }) => {
		const normalizedPathname = normalizePathname(location.pathname);

		if (normalizedPathname === "/settings") {
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
