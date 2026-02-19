import { useState } from "react";
import { toast } from "sonner";
import type { ModalContentProps } from "@/components/modal/modal-provider";
import { useLecturerMutations } from "@/components/pages/manage-lecturer/use-lecturer-mutations";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import type { Lecturer } from "@/lib/api/lecturers.functions";

export function LecturerEditForm({
	close,
	payload: lecturer,
}: ModalContentProps<Lecturer>) {
	const { updateMutation } = useLecturerMutations();
	const [formData, setFormData] = useState({
		firstName: lecturer.firstName,
		lastName: lecturer.lastName,
		identifier: lecturer.identifier,
		email: lecturer.email,
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password && formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (formData.password && formData.password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}

		// Only include password if it was changed
		const { confirmPassword: _confirmPassword, password, ...rest } = formData;
		const submitData = {
			...rest,
			id: lecturer.id,
			...(password ? { password } : {}),
		};

		updateMutation.mutate(submitData, {
			onSuccess: () => close(),
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<Field>
					<FieldLabel>First Name</FieldLabel>
					<FieldContent>
						<Input
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							required
						/>
					</FieldContent>
				</Field>
				<Field>
					<FieldLabel>Last Name</FieldLabel>
					<FieldContent>
						<Input
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							required
						/>
					</FieldContent>
				</Field>
			</div>

			<Field>
				<FieldLabel>Lecturer ID (Identifier)</FieldLabel>
				<FieldContent>
					<Input
						name="identifier"
						value={formData.identifier}
						onChange={handleChange}
						required
					/>
				</FieldContent>
			</Field>

			<Field>
				<FieldLabel>Email</FieldLabel>
				<FieldContent>
					<Input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</FieldContent>
			</Field>

			<div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
				<div className="space-y-1">
					<h4 className="text-sm font-medium">Reset Password</h4>
					<p className="text-xs text-muted-foreground">
						Leave blank if you don't want to change the password.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<Field>
						<FieldLabel>New Password</FieldLabel>
						<FieldContent>
							<PasswordInput
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="••••••••"
							/>
						</FieldContent>
					</Field>
					<Field>
						<FieldLabel>Confirm New Password</FieldLabel>
						<FieldContent>
							<PasswordInput
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder="••••••••"
							/>
						</FieldContent>
					</Field>
				</div>
			</div>

			<DialogFooter className="pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={close}
					disabled={updateMutation.isPending}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={updateMutation.isPending}>
					{updateMutation.isPending ? "Updating..." : "Update Lecturer"}
				</Button>
			</DialogFooter>
		</form>
	);
}
