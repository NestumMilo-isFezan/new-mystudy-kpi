import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/hooks/use-modal";
import type { UserProfile } from "@/lib/api/profile.functions";
import { useSaveProfileMutation } from "@/lib/auth/session-query";

export function ProfileForm({ profile }: { profile: UserProfile | null }) {
	const saveProfileMutation = useSaveProfileMutation();
	const modal = useModal();

	const form = useForm({
		defaultValues: {
			firstName: profile?.firstName ?? "",
			lastName: profile?.lastName ?? "",
			bio: profile?.bio ?? "",
			birthDate: profile?.birthDate ?? "",
			birthPlace: profile?.birthPlace ?? "",
		},
		onSubmit: async ({ value }) => {
			modal.open({
				title: "Save Profile",
				description:
					"Are you sure you want to save these changes to your profile?",
				Content: ConfirmModal,
				payload: {
					onConfirm: async () => {
						try {
							await saveProfileMutation.mutateAsync({
								...value,
								bio: value.bio.trim() || null,
								birthDate: value.birthDate || null,
								birthPlace: value.birthPlace.trim() || null,
							});
							toast.success("Profile updated successfully");
						} catch (error) {
							toast.error(
								error instanceof Error
									? error.message
									: "Failed to update profile",
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
				<form.Field name="firstName">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>First Name</Label>
							<Input
								id={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. John"
								required
							/>
						</div>
					)}
				</form.Field>
				<form.Field name="lastName">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Last Name</Label>
							<Input
								id={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. Doe"
								required
							/>
						</div>
					)}
				</form.Field>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<form.Field name="birthDate">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Birth Date</Label>
							<Input
								id={field.name}
								type="date"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Select your birth date"
							/>
						</div>
					)}
				</form.Field>
				<form.Field name="birthPlace">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Birth Place</Label>
							<Input
								id={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. Kota Kinabalu"
							/>
						</div>
					)}
				</form.Field>
			</div>

			<form.Field name="bio">
				{(field) => (
					<div className="grid gap-2">
						<Label htmlFor={field.name}>Bio</Label>
						<Textarea
							id={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="Tell us about yourself..."
						/>
					</div>
				)}
			</form.Field>

			<div className="flex justify-end">
				<Button type="submit" disabled={saveProfileMutation.isPending}>
					{saveProfileMutation.isPending ? "Saving..." : "Save Profile"}
				</Button>
			</div>
		</form>
	);
}
