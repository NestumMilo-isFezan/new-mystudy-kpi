import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal";
import type { AuthUser } from "@/lib/api/auth.functions";
import { useUpdateAccountMutation } from "@/lib/auth/account-query";
import { mapRole } from "@/lib/auth/role-map";
import { IntakeBatchSelector } from "./intake-batch-selector";

export function AccountForm({ user }: { user: AuthUser }) {
	const updateAccountMutation = useUpdateAccountMutation();
	const modal = useModal();

	const isStudent = mapRole(user.role) === "student";

	const form = useForm({
		defaultValues: {
			identifier: user.identifier,
			email: user.email,
			intakeBatchId: user.intake?.id ?? 0,
		},
		onSubmit: async ({ value }) => {
			if (isStudent && value.intakeBatchId <= 0) {
				toast.error("Please select an intake batch");
				return;
			}

			modal.open({
				title: "Update Account",
				description:
					"Are you sure you want to update your account information?",
				Content: ConfirmModal,
				payload: {
					onConfirm: async () => {
						try {
							await updateAccountMutation.mutateAsync({
								intakeBatchId: value.intakeBatchId,
							});
							toast.success("Account updated successfully");
						} catch (error) {
							toast.error(
								error instanceof Error
									? error.message
									: "Failed to update account",
							);
						}
					},
				},
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<form.Field name="identifier">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Identifier</Label>
							<Input
								id={field.name}
								value={field.state.value}
								disabled
								className="bg-muted"
							/>
						</div>
					)}
				</form.Field>
				<form.Field name="email">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Email</Label>
							<Input
								id={field.name}
								value={field.state.value}
								disabled
								className="bg-muted"
							/>
						</div>
					)}
				</form.Field>
			</div>

			{isStudent && (
				<form.Field name="intakeBatchId">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Intake Batch</Label>
							<IntakeBatchSelector
								value={field.state.value}
								onChange={(val) => field.handleChange(val)}
							/>
						</div>
					)}
				</form.Field>
			)}

			<div className="flex justify-end">
				<Button type="submit" disabled={updateAccountMutation.isPending}>
					{updateAccountMutation.isPending
						? "Updating..."
						: "Save Account Info"}
				</Button>
			</div>
		</form>
	);
}
