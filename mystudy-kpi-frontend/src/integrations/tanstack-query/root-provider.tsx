import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

let browserQueryClient: QueryClient | undefined;

function createQueryClient() {
	return new QueryClient();
}

function getQueryClient() {
	if (typeof window === "undefined") {
		return createQueryClient();
	}

	if (!browserQueryClient) {
		browserQueryClient = createQueryClient();
	}

	return browserQueryClient;
}

export function getContext() {
	const queryClient = getQueryClient();
	return {
		queryClient,
	};
}

export default function TanStackQueryProvider({
	queryClient,
	children,
}: {
	queryClient: QueryClient;
	children: ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
