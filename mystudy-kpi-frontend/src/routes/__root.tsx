import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import PublicLayout from "@/components/layouts/public-layout";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import { getServerSession } from "../lib/auth/get-server-session";
import { sessionQueryKey } from "../lib/auth/session-query";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	loader: async ({ context }) => {
		const initialSession = await getServerSession();
		context.queryClient.setQueryData(sessionQueryKey, initialSession);

		return {
			initialSession,
		};
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "MyStudy KPI",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { queryClient } = Route.useRouteContext();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const showLandingHeader = pathname === "/";

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<TanStackQueryProvider queryClient={queryClient}>
					{showLandingHeader ? (
						<PublicLayout>{children}</PublicLayout>
					) : (
						children
					)}
					{import.meta.env.DEV ? (
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
								TanStackQueryDevtools,
							]}
						/>
					) : null}
				</TanStackQueryProvider>
				<Scripts />
			</body>
		</html>
	);
}
