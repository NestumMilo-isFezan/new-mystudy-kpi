import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import AuthPageShell from "@/components/layouts/auth-page-shell";
import {
	AuthCard,
	type AuthFormValues,
} from "@/components/pages/auth/auth-card";
import { useLoginMutation } from "@/lib/auth/session-query";

export const Route = createFileRoute("/_public/login")({
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const loginMutation = useLoginMutation();
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (values: AuthFormValues) => {
		setError(null);

		try {
			await loginMutation.mutateAsync({
				identifier: values.identifier,
				password: values.password,
			});
			await navigate({ to: "/dashboard" });
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Unable to sign in right now.",
			);
		}
	};

	return (
		<AuthPageShell>
			<AuthCard
				mode="login"
				onSubmit={handleSubmit}
				isPending={loginMutation.isPending}
				error={error}
			/>
		</AuthPageShell>
	);
}
