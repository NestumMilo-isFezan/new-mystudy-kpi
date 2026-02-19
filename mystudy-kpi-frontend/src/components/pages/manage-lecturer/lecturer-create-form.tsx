import { useState } from "react";
import { toast } from "sonner";
import type { ModalContentProps } from "@/components/modal/modal-provider";
import { useLecturerMutations } from "@/components/pages/manage-lecturer/use-lecturer-mutations";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

export function LecturerCreateForm({ close }: ModalContentProps<unknown>) {
	const { createMutation } = useLecturerMutations();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		identifier: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (formData.password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}

		const { confirmPassword: _confirmPassword, ...submitData } = formData;
		createMutation.mutate(submitData, {
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
							placeholder="John"
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
							placeholder="Doe"
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
						placeholder="LEC001"
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
						placeholder="john.doe@example.com"
					/>
				</FieldContent>
			</Field>

			<div className="grid grid-cols-2 gap-4">
				<Field>
					<FieldLabel>Password</FieldLabel>
					<FieldContent>
						<PasswordInput
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							placeholder="••••••••"
						/>
					</FieldContent>
				</Field>
				<Field>
					<FieldLabel>Confirm Password</FieldLabel>
					<FieldContent>
						<PasswordInput
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							required
							placeholder="••••••••"
						/>
					</FieldContent>
				</Field>
			</div>

			<DialogFooter className="pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={close}
					disabled={createMutation.isPending}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={createMutation.isPending}>
					{createMutation.isPending ? "Creating..." : "Save Lecturer"}
				</Button>
			</DialogFooter>
		</form>
	);
}
