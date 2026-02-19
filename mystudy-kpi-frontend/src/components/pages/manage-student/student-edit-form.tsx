import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { ModalContentProps } from "@/components/modal/modal-provider";
import { IntakeBatchSelector } from "@/components/pages/manage-student/intake-batch-selector";
import { StudentIdInput } from "@/components/pages/manage-student/student-id-input";
import { useStudentMutations } from "@/components/pages/manage-student/use-student-mutations";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { allIntakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";
import type { Student } from "@/lib/api/students.functions";

export function StudentEditForm({
	close,
	payload: student,
}: ModalContentProps<Student>) {
	const { updateMutation } = useStudentMutations();
	const { data: batches } = useSuspenseQuery(allIntakeBatchesQueryOptions);
	const [formData, setFormData] = useState({
		firstName: student.firstName,
		lastName: student.lastName,
		identifier: student.identifier,
		email: student.email,
		intakeBatchId: student.intake?.id ?? 0,
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleIdentifierChange = (val: string) => {
		setFormData((prev) => ({ ...prev, identifier: val }));
	};

	const handleIntakeChange = (id: number) => {
		setFormData((prev) => {
			// Extract existing manual part if any
			const batch = batches.find((b) => b.id === prev.intakeBatchId);
			const currentPrefix = batch
				? `BI${batch.startYear.toString().slice(-2)}`
				: "BIXX";
			const manualPart = prev.identifier.startsWith(currentPrefix)
				? prev.identifier.slice(currentPrefix.length)
				: prev.identifier;

			// Generate new prefix
			const newBatch = batches.find((b) => b.id === id);
			const newPrefix = newBatch
				? `BI${newBatch.startYear.toString().slice(-2)}`
				: "BIXX";

			return {
				...prev,
				intakeBatchId: id,
				identifier: `${newPrefix}${manualPart}`,
			};
		});
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

		const { confirmPassword: _confirmPassword, password, ...rest } = formData;
		const submitData = {
			...rest,
			id: student.id,
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
				<FieldLabel>Student ID (Identifier)</FieldLabel>
				<FieldContent>
					<StudentIdInput
						value={formData.identifier}
						onChange={handleIdentifierChange}
						intakeBatchId={formData.intakeBatchId}
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

			<Field>
				<FieldLabel>Intake Batch</FieldLabel>
				<FieldContent>
					<IntakeBatchSelector
						value={formData.intakeBatchId}
						onChange={handleIntakeChange}
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
					{updateMutation.isPending ? "Updating..." : "Update Student"}
				</Button>
			</DialogFooter>
		</form>
	);
}
