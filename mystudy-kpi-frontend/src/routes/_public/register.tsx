import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import AuthPageShell from "@/components/layouts/auth-page-shell";
import {
	AuthCard,
	type AuthFormValues,
} from "@/components/pages/auth/auth-card";
import { getIntakeBatchesFn as getIntakeBatches } from "@/lib/api/intake-batches.functions";
import { useRegisterMutation } from "@/lib/auth/session-query";

export const Route = createFileRoute("/_public/register")({
	component: RegisterPage,
});

function RegisterPage() {
	const navigate = useNavigate();
	const registerMutation = useRegisterMutation();
	const intakeBatchesQuery = useQuery({
		queryKey: ["intake-batches"],
		queryFn: getIntakeBatches,
		retry: false,
	});

	const [error, setError] = useState<string | null>(null);
	const intakeBatchesError = intakeBatchesQuery.isError
		? "Unable to load intake batches. Please retry."
		: null;

	const handleSubmit = async (values: AuthFormValues) => {
		setError(null);

		if (values.password !== values.confirmPassword) {
			setError("Password confirmation does not match.");
			return;
		}

		const parsedBatchId = Number.parseInt(values.intakeBatchId, 10);
		if (Number.isNaN(parsedBatchId)) {
			setError("Please select an intake batch.");
			return;
		}

		try {
			await registerMutation.mutateAsync({
				identifier: values.identifier,
				email: values.email,
				password: values.password,
				intakeBatchId: parsedBatchId,
			});
			await navigate({ to: "/login" });
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Unable to create account right now.",
			);
		}
	};

	return (
		<AuthPageShell>
			<AuthCard
				mode="register"
				onSubmit={handleSubmit}
				isPending={registerMutation.isPending || intakeBatchesQuery.isPending}
				intakeBatches={intakeBatchesQuery.data}
				error={error ?? intakeBatchesError}
			/>
			{intakeBatchesQuery.isError ? (
				<div className="mt-4 flex justify-center">
					<button
						type="button"
						onClick={() => intakeBatchesQuery.refetch()}
						className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						Retry loading intake batches
					</button>
				</div>
			) : null}
		</AuthPageShell>
	);
}
