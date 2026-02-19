import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useModal } from "@/hooks/use-modal";
import { useUpdatePasswordMutation } from "@/lib/auth/account-query";

export function PasswordForm() {
	const updatePasswordMutation = useUpdatePasswordMutation();
	const modal = useModal();

	const form = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
		onSubmit: async ({ value }) => {
			modal.open({
				title: "Change Password",
				description:
					"Are you sure you want to change your password? You will need to use the new password for your next login.",
				Content: ConfirmModal,
				payload: {
					onConfirm: async () => {
						try {
							await updatePasswordMutation.mutateAsync(value);
							toast.success("Password updated successfully");
							form.reset();
						} catch (error) {
							toast.error(
								error instanceof Error
									? error.message
									: "Failed to update password",
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
			<form.Field name="currentPassword">
				{(field) => (
					<div className="grid gap-2">
						<Label htmlFor={field.name}>Current Password</Label>
						<PasswordInput
							id={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="Enter your current password"
							required
						/>
					</div>
				)}
			</form.Field>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<form.Field name="newPassword">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>New Password</Label>
							<PasswordInput
								id={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Enter a new strong password"
								required
								autoComplete="new-password"
							/>
						</div>
					)}
				</form.Field>
				<form.Field
					name="confirmPassword"
					validators={{
						onChange: ({ value, fieldApi }) => {
							if (value !== fieldApi.form.getFieldValue("newPassword")) {
								return "Passwords do not match";
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Confirm New Password</Label>
							<PasswordInput
								id={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Repeat the new password"
								required
								autoComplete="new-password"
							/>
							{field.state.meta.errors ? (
								<em className="text-xs text-destructive">
									{field.state.meta.errors.join(", ")}
								</em>
							) : null}
						</div>
					)}
				</form.Field>
			</div>

			<div className="flex justify-end">
				<Button type="submit" disabled={updatePasswordMutation.isPending}>
					{updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
				</Button>
			</div>
		</form>
	);
}
