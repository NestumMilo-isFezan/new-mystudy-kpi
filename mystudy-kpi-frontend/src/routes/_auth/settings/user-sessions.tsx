import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { SessionList } from "@/components/pages/settings/user-session/session-list";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useModal } from "@/hooks/use-modal";
import {
	useRevokeOtherSessionsMutation,
	userSessionsQueryOptions,
	useUserSessionsSuspenseQuery,
} from "@/lib/auth/session-query";
import { useLogoutAndRedirect } from "@/lib/auth/use-logout-and-redirect";

export const Route = createFileRoute("/_auth/settings/user-sessions")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(userSessionsQueryOptions);
	},
	component: UserSessionsPage,
});

function UserSessionsPage() {
	const { data: sessions } = useUserSessionsSuspenseQuery();
	const revokeOthersMutation = useRevokeOtherSessionsMutation();
	const { logoutAndRedirect } = useLogoutAndRedirect();
	const modal = useModal();

	const handleLogoutAllOthers = () => {
		modal.open({
			title: "Logout All Other Devices",
			description:
				"Are you sure you want to log out from all other devices? You will remain logged in on this device.",
			size: "sm",
			Content: ConfirmationModalContent,
			payload: {
				onConfirm: () =>
					revokeOthersMutation.mutate(undefined, {
						onSuccess: () => {
							// After successful revocation of others, ask if they want to logout current too
							modal.open({
								title: "Logout Current Session?",
								description:
									"All other sessions have been revoked. Do you also want to log out from this device?",
								size: "sm",
								Content: ConfirmationModalContent,
								payload: {
									onConfirm: () => logoutAndRedirect(),
									confirmLabel: "Logout current session",
									cancelLabel: "Stay logged in",
								},
							});
						},
					}),
				confirmLabel: "Logout others",
				variant: "destructive",
				isPending: revokeOthersMutation.isPending,
			},
		});
	};

	return (
		<div className="flex flex-col gap-8 text-foreground">
			<Heading
				title="Browser Sessions"
				description="Manage your account security and active browser sessions."
				icon={ShieldCheck}
			>
				<Button
					type="button"
					variant="destructive"
					onClick={handleLogoutAllOthers}
					disabled={
						revokeOthersMutation.isPending || (sessions?.length ?? 0) <= 1
					}
					className="w-full md:w-auto"
				>
					<ShieldAlert className="mr-2 size-4" />
					Logout all other devices
				</Button>
			</Heading>

			<div className="grid gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
						Active Sessions ({sessions.length})
					</h3>
				</div>

				<SessionList />
			</div>
		</div>
	);
}
