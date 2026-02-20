import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ModalContentProps } from "@/components/modal/modal-provider";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { academicsQueryOptions } from "@/lib/api/academics-query";
import type {
	Challenge,
	SaveChallengePayload,
} from "@/lib/api/challenges.functions";
import { useChallengeMutations } from "./use-challenge-mutations";

export function ChallengeForm({
	close,
	payload,
}: ModalContentProps<Challenge | undefined>) {
	const { data: semesters } = useSuspenseQuery(academicsQueryOptions);
	const { createMutation, updateMutation } = useChallengeMutations();

	const isEditing = !!payload;

	const form = useForm({
		defaultValues: {
			semesterRecordId: payload?.semester.id || semesters[0]?.id || 0,
			challenge: payload?.challenge || "",
			plan: payload?.plan || "",
			notes: payload?.notes || "",
		} as SaveChallengePayload,
		onSubmit: async ({ value }) => {
			if (isEditing) {
				updateMutation.mutate(
					{ id: payload.id, payload: value },
					{ onSuccess: () => close() },
				);
			} else {
				createMutation.mutate(value, { onSuccess: () => close() });
			}
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<form.Field name="semesterRecordId">
				{(field) => (
					<Field>
						<FieldLabel>Semester</FieldLabel>
						<FieldContent>
							<Select
								value={field.state.value.toString()}
								onValueChange={(val) => {
									if (!val) return;
									field.handleChange(Number.parseInt(val, 10));
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select term" />
								</SelectTrigger>
								<SelectContent>
									{semesters.map((s) => (
										<SelectItem key={s.id} value={s.id.toString()}>
											{s.termString}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FieldContent>
					</Field>
				)}
			</form.Field>

			<form.Field
				name="challenge"
				validators={{
					onChange: ({ value }) =>
						!value ? "Challenge description is required" : undefined,
				}}
			>
				{(field) => (
					<Field>
						<FieldLabel>Challenge</FieldLabel>
						<FieldContent>
							<Textarea
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="What hurdles did you face?"
								className={
									field.state.meta.errors.length ? "border-destructive" : ""
								}
							/>
							{field.state.meta.errors.length > 0 && (
								<p className="text-xs text-destructive mt-1">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</FieldContent>
					</Field>
				)}
			</form.Field>

			<form.Field
				name="plan"
				validators={{
					onChange: ({ value }) =>
						!value ? "Mitigation plan is required" : undefined,
				}}
			>
				{(field) => (
					<Field>
						<FieldLabel>Plan</FieldLabel>
						<FieldContent>
							<Textarea
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="How do you plan to overcome it?"
								className={
									field.state.meta.errors.length ? "border-destructive" : ""
								}
							/>
							{field.state.meta.errors.length > 0 && (
								<p className="text-xs text-destructive mt-1">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</FieldContent>
					</Field>
				)}
			</form.Field>

			<form.Field name="notes">
				{(field) => (
					<Field>
						<FieldLabel>Notes (Optional)</FieldLabel>
						<FieldContent>
							<Textarea
								value={field.state.value || ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Any extra remarks..."
							/>
						</FieldContent>
					</Field>
				)}
			</form.Field>

			<DialogFooter>
				<Button type="button" variant="outline" onClick={close}>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={createMutation.isPending || updateMutation.isPending}
				>
					{isEditing ? "Update Challenge" : "Create Challenge"}
				</Button>
			</DialogFooter>
		</form>
	);
}
