import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { useLogoutMutation } from "./session-query";

export function useLogoutAndRedirect() {
	const navigate = useNavigate();
	const logoutMutation = useLogoutMutation();

	const logoutAndRedirect = useCallback(async () => {
		await logoutMutation.mutateAsync();
		await navigate({ to: "/login" });
	}, [logoutMutation, navigate]);

	return {
		logoutAndRedirect,
		isPending: logoutMutation.isPending,
	};
}
