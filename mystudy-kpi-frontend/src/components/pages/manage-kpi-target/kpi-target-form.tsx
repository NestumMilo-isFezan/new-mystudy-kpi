import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import type { SaveKpiAimPayload } from "@/lib/api/kpi-aim.functions";
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

export function KpiTargetForm() {
	const { data } = useSuspenseQuery(kpiAimQueryOptions);
	const { updateMutation } = useKpiTargetMutations();

	const defaultForm = useMemo<SaveKpiAimPayload>(() => {
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

	const [form, setForm] = useState<SaveKpiAimPayload>(defaultForm);

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				updateMutation.mutate(form);
			}}
			className="space-y-8"
		>
			<section className="space-y-3 border-t border-border pt-6">
				<h2 className="text-base font-semibold">Academics</h2>
				<Field>
					<FieldLabel>Target CGPA</FieldLabel>
					<FieldContent>
						<Input
							type="number"
							step="0.01"
							min="0"
							max="4"
							value={form.cgpa}
							onChange={(event) =>
								setForm({ ...form, cgpa: event.target.value })
							}
							required
						/>
					</FieldContent>
				</Field>
			</section>

			<section className="space-y-3 border-t border-border pt-6">
				<h2 className="text-base font-semibold">Activities</h2>
				<div className="grid gap-3 md:grid-cols-3">
					{levelKeys.map((key) => (
						<Field key={`activities-${key}`}>
							<FieldLabel>{toTitle(key)}</FieldLabel>
							<FieldContent>
								<NumberInput
									min={0}
									value={form.activities[key]}
									onChange={(value) =>
										setForm({
											...form,
											activities: { ...form.activities, [key]: value },
										})
									}
								/>
							</FieldContent>
						</Field>
					))}
				</div>
			</section>

			<section className="space-y-3 border-t border-border pt-6">
				<h2 className="text-base font-semibold">Competitions</h2>
				<div className="grid gap-3 md:grid-cols-3">
					{levelKeys.map((key) => (
						<Field key={`competitions-${key}`}>
							<FieldLabel>{toTitle(key)}</FieldLabel>
							<FieldContent>
								<NumberInput
									min={0}
									value={form.competitions[key]}
									onChange={(value) =>
										setForm({
											...form,
											competitions: { ...form.competitions, [key]: value },
										})
									}
								/>
							</FieldContent>
						</Field>
					))}
				</div>
			</section>

			<section className="space-y-3 border-t border-border pt-6">
				<h2 className="text-base font-semibold">Certificates</h2>
				<div className="grid gap-3 md:grid-cols-3">
					{certificateKeys.map((key) => (
						<Field key={`certificates-${key}`}>
							<FieldLabel>{toTitle(key)}</FieldLabel>
							<FieldContent>
								<NumberInput
									min={0}
									value={form.certificates[key]}
									onChange={(value) =>
										setForm({
											...form,
											certificates: { ...form.certificates, [key]: value },
										})
									}
								/>
							</FieldContent>
						</Field>
					))}
				</div>
			</section>

			<div className="flex flex-wrap justify-end gap-2 border-t border-border pt-6">
				<Button type="submit" disabled={updateMutation.isPending}>
					Save Personal Target
				</Button>
			</div>
		</form>
	);
}

function toTitle(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
