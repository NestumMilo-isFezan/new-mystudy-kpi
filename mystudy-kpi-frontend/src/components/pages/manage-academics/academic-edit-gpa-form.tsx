import { useState } from "react";
import type { ModalContentProps } from "@/components/modal/modal-provider";
import { useAcademicsMutations } from "@/components/pages/manage-academics/use-academics-mutations";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { NumberInput } from "@/components/ui/number-input";
import type { AcademicRecord } from "@/lib/api/academics-query";

export function AcademicEditGpaForm({
	close,
	payload,
}: ModalContentProps<AcademicRecord>) {
	const [gpa, setGpa] = useState<number>(
		payload.gpa ? Number.parseFloat(payload.gpa) : 0,
	);
	const { updateGpaMutation } = useAcademicsMutations();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateGpaMutation.mutate(
			{ id: payload.id, gpa: gpa.toFixed(2) },
			{
				onSuccess: () => close(),
			},
		);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<Field>
				<FieldLabel>GPA for {payload.termString}</FieldLabel>
				<FieldContent>
					<NumberInput
						variant="float"
						step={0.01}
						min={0}
						max={4}
						value={gpa}
						onChange={(val) => setGpa(val)}
						required
					/>
				</FieldContent>
			</Field>

			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={close}
					disabled={updateGpaMutation.isPending}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={updateGpaMutation.isPending}>
					{updateGpaMutation.isPending ? "Updating..." : "Update GPA"}
				</Button>
			</DialogFooter>
		</form>
	);
}
