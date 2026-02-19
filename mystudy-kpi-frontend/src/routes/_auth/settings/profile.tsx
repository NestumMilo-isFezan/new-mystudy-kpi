import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Fingerprint, Key, User, UserX } from "lucide-react";
import { Suspense } from "react";
import { AccountForm } from "@/components/pages/settings/profile/account-form";
import { DeleteAccountSection } from "@/components/pages/settings/profile/delete-account-section";
import { PasswordForm } from "@/components/pages/settings/profile/password-form";
import { ProfileForm } from "@/components/pages/settings/profile/profile-form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { intakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";
import { sessionQueryOptions } from "@/lib/auth/session-query";

export const Route = createFileRoute("/_auth/settings/profile")({
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(sessionQueryOptions),
			context.queryClient.ensureQueryData(intakeBatchesQueryOptions),
		]);
	},
	component: ProfileSettingsPage,
});

function ProfileSettingsPage() {
	const { data: session } = useSuspenseQuery(sessionQueryOptions);

	if (!session) {
		return null;
	}

	return (
		<div className="flex flex-col gap-10 text-foreground pb-20">
			{/* User Profile Section */}
			<section className="flex flex-col gap-6">
				<Heading
					title="User Profile"
					description="Update your personal information and biography."
					icon={User}
				/>
				<ProfileForm profile={session.profile} />
			</section>

			<Separator />

			{/* User Account Section */}
			<section className="flex flex-col gap-6">
				<Heading
					title="User Account"
					description="Manage your account identification and academic intake."
					icon={Fingerprint}
				/>
				<Suspense
					fallback={<div className="h-40 bg-muted animate-pulse rounded-lg" />}
				>
					<AccountForm user={session.user} />
				</Suspense>
			</section>

			<Separator />

			{/* User Password Section */}
			<section className="flex flex-col gap-6">
				<Heading
					title="User Password"
					description="Secure your account with a strong, unique password."
					icon={Key}
				/>
				<PasswordForm />
			</section>

			<Separator />

			{/* Account Deletion Section */}
			<section className="flex flex-col gap-6">
				<Heading
					title="Account Deletion"
					description="Permanently remove your account and all associated data."
					icon={UserX}
				/>
				<DeleteAccountSection />
			</section>
		</div>
	);
}
