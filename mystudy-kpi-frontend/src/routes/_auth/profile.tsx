import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";

import { useAuth } from "@/lib/auth/auth-context";
import { useSaveProfileMutation } from "@/lib/auth/session-query";

export const Route = createFileRoute("/_auth/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const saveProfileMutation = useSaveProfileMutation();
	const { session } = useAuth();

	const firstNameInputId = useId();
	const lastNameInputId = useId();
	const bioInputId = useId();
	const birthDateInputId = useId();
	const birthPlaceInputId = useId();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [bio, setBio] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [birthPlace, setBirthPlace] = useState("");
	const [notice, setNotice] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!session) {
			return;
		}

		setFirstName(session.profile?.firstName ?? "");
		setLastName(session.profile?.lastName ?? "");
		setBio(session.profile?.bio ?? "");
		setBirthDate(session.profile?.birthDate ?? "");
		setBirthPlace(session.profile?.birthPlace ?? "");
	}, [session]);

	if (!session) {
		return null;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setNotice(null);
		setError(null);

		try {
			const result = await saveProfileMutation.mutateAsync({
				firstName,
				lastName,
				bio: bio.trim() ? bio : null,
				birthDate: birthDate.trim() ? birthDate : null,
				birthPlace: birthPlace.trim() ? birthPlace : null,
			});

			setNotice(result.message);
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Unable to save profile right now.",
			);
		}
	};

	return (
		<div className="py-6 text-foreground">
			<section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
				<h2 className="text-3xl font-semibold">Profile</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					Keep your profile details up to date for KPI records.
				</p>

				<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
					<label
						className="block text-sm font-medium text-foreground"
						htmlFor={firstNameInputId}
					>
						First name
					</label>
					<input
						id={firstNameInputId}
						type="text"
						value={firstName}
						onChange={(event) => setFirstName(event.target.value)}
						className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
						required
					/>

					<label
						className="block text-sm font-medium text-foreground"
						htmlFor={lastNameInputId}
					>
						Last name
					</label>
					<input
						id={lastNameInputId}
						type="text"
						value={lastName}
						onChange={(event) => setLastName(event.target.value)}
						className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
						required
					/>

					<label
						className="block text-sm font-medium text-foreground"
						htmlFor={bioInputId}
					>
						Bio
					</label>
					<textarea
						id={bioInputId}
						value={bio}
						onChange={(event) => setBio(event.target.value)}
						rows={4}
						className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
					/>

					<label
						className="block text-sm font-medium text-foreground"
						htmlFor={birthDateInputId}
					>
						Birth date
					</label>
					<input
						id={birthDateInputId}
						type="date"
						value={birthDate}
						onChange={(event) => setBirthDate(event.target.value)}
						className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
					/>

					<label
						className="block text-sm font-medium text-foreground"
						htmlFor={birthPlaceInputId}
					>
						Birth place
					</label>
					<input
						id={birthPlaceInputId}
						type="text"
						value={birthPlace}
						onChange={(event) => setBirthPlace(event.target.value)}
						className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
					/>

					{notice ? (
						<p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
							{notice}
						</p>
					) : null}
					{error ? (
						<p className="rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
							{error}
						</p>
					) : null}

					<button
						type="submit"
						disabled={saveProfileMutation.isPending}
						className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{saveProfileMutation.isPending
							? "Saving profile..."
							: "Save profile"}
					</button>
				</form>
			</section>
		</div>
	);
}
