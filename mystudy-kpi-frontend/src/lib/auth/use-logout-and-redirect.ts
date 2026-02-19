import { useCallback } from "react";

import { useLogoutMutation } from "./session-query";

export function useLogoutAndRedirect() {
	const logoutMutation = useLogoutMutation();

	const logoutAndRedirect = useCallback(async () => {
		try {
			await logoutMutation.mutateAsync();
		} catch (_error) {
			// Ignore errors on logout to ensure we still redirect
		}

		// Force a full page reload to clear all in-memory state and reset the app context
		window.location.href = "/login";
	}, [logoutMutation]);

	return {
		logoutAndRedirect,
		isPending: logoutMutation.isPending,
	};
}
