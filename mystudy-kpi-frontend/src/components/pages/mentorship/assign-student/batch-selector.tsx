import { IntakeBatchSelector } from "@/components/pages/mentorship/manage-student/intake-batch-selector";
import { Label } from "@/components/ui/label";
import { useAssignStudentContext } from "./provider";

export function BatchSelector() {
	const { selectedBatchId, lockedBatchId, onBatchChange } =
		useAssignStudentContext();

	return (
		<div className="space-y-2">
			<Label className="text-sm font-medium">Intake Batch</Label>
			<IntakeBatchSelector
				value={selectedBatchId}
				source="active"
				disabled={Boolean(lockedBatchId)}
				onChange={onBatchChange}
			/>
			{lockedBatchId && (
				<p className="text-xs text-amber-600 font-medium">
					Batch is locked for this mentorship.
				</p>
			)}
		</div>
	);
}
