import { useForm } from "@tanstack/react-form";
import {
	type UseSuspenseQueryOptions,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import type {
	KpiAimResponse,
	SaveKpiAimPayload,
} from "@/lib/api/kpi-aim.functions";
import { kpiAimQueryOptions } from "@/lib/api/kpi-aim-query";
import { useKpiTargetMutations } from "./use-kpi-target-mutations";

const levelKeys = [
	"faculty",
	"university",
	"local",
	"national",
	"international",
] as const;
const certificateKeys = ["professional", "technical"] as const;

type KpiTargetFormProps = {
	queryOptions?: unknown;
	onSubmit?: (data: SaveKpiAimPayload) => void;
	isPending?: boolean;
	submitLabel?: string;
};

export function KpiTargetForm({
	queryOptions: customQueryOptions = kpiAimQueryOptions,
	onSubmit: customOnSubmit,
	isPending: customIsPending,
	submitLabel = "Save Personal Target",
}: KpiTargetFormProps) {
	const { data } = useSuspenseQuery(
		customQueryOptions as UseSuspenseQueryOptions<KpiAimResponse>,
	);
	const { updateMutation } = useKpiTargetMutations();

	const defaultValues = useMemo<SaveKpiAimPayload>(() => {
		if (data.personal) {
			return {
				cgpa: data.personal.cgpa,
				activities: data.personal.activities,
				competitions: data.personal.competitions,
				certificates: data.personal.certificates,
			};
		}

		const fallback = data.lecturer ?? data.batch;
		if (fallback) {
			return {
				cgpa: fallback.cgpa,
				activities: fallback.activities,
				competitions: fallback.competitions,
				certificates: fallback.certificates,
			};
		}

		return {
			cgpa: "3.00",
			activities: {
				faculty: 0,
				university: 0,
				local: 0,
				national: 0,
				international: 0,
			},
			competitions: {
				faculty: 0,
				university: 0,
				local: 0,
				national: 0,
				international: 0,
			},
			certificates: {
				professional: 0,
				technical: 0,
			},
		};
	}, [data]);

	const isPending = customIsPending ?? updateMutation.isPending;
	const onSubmit = customOnSubmit ?? ((data) => updateMutation.mutate(data));

	const form = useForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	return (
		<form
			action={() => {
				form.handleSubmit();
			}}
			className="space-y-8"
		>
			<section className="space-y-3 border-t border-border pt-6">
				<h2 className="text-base font-semibold">Academics</h2>
				<form.Field name="cgpa">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Target CGPA</FieldLabel>
							<FieldContent>
								<Input
									id={field.name}
									type="number"
									step="0.01"
									min="0"
									max="4"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
									required
								/>
							</FieldContent>
						</Field>
					)}
				</form.Field>
			</section>

			<section className="space-y-3 border-t border-border pt-6">
				<h2 className="text-base font-semibold">Activities</h2>
				<div className="grid gap-3 md:grid-cols-3">
					{levelKeys.map((key) => (
						<form.Field key={`activities-${key}`} name={`activities.${key}`}>
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>{toTitle(key)}</FieldLabel>
									<FieldContent>
										<NumberInput
											id={field.name}
											min={0}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(value) => field.handleChange(value)}
										/>
									</FieldContent>
								</Field>
							)}
						</form.Field>
					))}
				</div>
			</section>

			<section className="space-y-3 border-t border-border pt-6">
				<h2 className="text-base font-semibold">Competitions</h2>
				<div className="grid gap-3 md:grid-cols-3">
					{levelKeys.map((key) => (
						<form.Field
							key={`competitions-${key}`}
							name={`competitions.${key}`}
						>
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>{toTitle(key)}</FieldLabel>
									<FieldContent>
										<NumberInput
											id={field.name}
											min={0}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(value) => field.handleChange(value)}
										/>
									</FieldContent>
								</Field>
							)}
						</form.Field>
					))}
				</div>
			</section>

			<section className="space-y-3 border-t border-border pt-6">
				<h2 className="text-base font-semibold">Certificates</h2>
				<div className="grid gap-3 md:grid-cols-3">
					{certificateKeys.map((key) => (
						<form.Field
							key={`certificates-${key}`}
							name={`certificates.${key}`}
						>
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>{toTitle(key)}</FieldLabel>
									<FieldContent>
										<NumberInput
											id={field.name}
											min={0}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(value) => field.handleChange(value)}
										/>
									</FieldContent>
								</Field>
							)}
						</form.Field>
					))}
				</div>
			</section>

			<div className="flex flex-wrap justify-end gap-2 border-t border-border pt-6">
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<Button
							type="submit"
							disabled={!canSubmit || isSubmitting || isPending}
						>
							{submitLabel}
						</Button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}

function toTitle(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
