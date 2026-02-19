import { useState } from "react";
import { toast } from "sonner";
import type { ModalContentProps } from "@/components/modal/modal-provider";
import { useIntakeMutations } from "@/components/pages/manage-intake/use-intake-mutations";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { NumberInput } from "@/components/ui/number-input";
import type { IntakeBatch } from "@/lib/api/intake-batches.functions";

export function IntakeEditForm({
	close,
	payload,
}: ModalContentProps<IntakeBatch>) {
	const [startYear, setStartYear] = useState<number>(payload.startYear);
	const { updateMutation } = useIntakeMutations();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (startYear < 2000 || startYear > 2100) {
			toast.error("Please enter a valid year between 2000 and 2100");
			return;
		}
		updateMutation.mutate(
			{ id: payload.id, year: startYear },
			{
				onSuccess: () => close(),
			},
		);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<Field>
				<FieldLabel>Start Year</FieldLabel>
				<FieldContent>
					<NumberInput
						min={2000}
						max={2100}
						value={startYear}
						onChange={(val) => setStartYear(val)}
						required
					/>
				</FieldContent>
			</Field>

			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={close}
					disabled={updateMutation.isPending}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={updateMutation.isPending}>
					{updateMutation.isPending ? "Updating..." : "Update Intake"}
				</Button>
			</DialogFooter>
		</form>
	);
}
