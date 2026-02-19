import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { useDeleteAccountMutation } from "@/lib/auth/account-query";

export function DeleteAccountSection() {
	const deleteAccountMutation = useDeleteAccountMutation();
	const modal = useModal();
	const navigate = useNavigate();

	const handleDelete = () => {
		modal.open({
			title: "Permanently Delete Account?",
			description:
				"This will remove all your data from the system. This action is irreversible and cannot be undone.",
			Content: ConfirmModal,
			payload: {
				confirmText: "Delete Account",
				variant: "destructive",
				onConfirm: async () => {
					try {
						await deleteAccountMutation.mutateAsync();
						toast.success("Account deleted successfully");
						await navigate({ to: "/" });
					} catch (error) {
						toast.error(
							error instanceof Error
								? error.message
								: "Failed to delete account",
						);
					}
				},
			},
		});
	};

	return (
		<div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 transition-colors hover:bg-destructive/10">
			<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<div className="grid gap-1">
					<h3 className="font-semibold text-destructive">Danger Zone</h3>
					<p className="text-sm text-muted-foreground max-w-xl">
						Once you delete your account, there is no going back. All your KPI
						data, profiles, and academic records will be permanently removed.
					</p>
				</div>
				<Button
					type="button"
					variant="destructive"
					onClick={handleDelete}
					disabled={deleteAccountMutation.isPending}
					className="w-full md:w-auto"
				>
					{deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
				</Button>
			</div>
		</div>
	);
}
