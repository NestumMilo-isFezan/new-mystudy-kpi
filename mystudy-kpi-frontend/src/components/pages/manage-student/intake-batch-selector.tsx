import { useSuspenseQuery } from "@tanstack/react-query";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { allIntakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";

type IntakeBatchSelectorProps = {
	value: number | string;
	onChange: (value: number) => void;
};

export function IntakeBatchSelector({
	value,
	onChange,
}: IntakeBatchSelectorProps) {
	const { data: batches } = useSuspenseQuery(allIntakeBatchesQueryOptions);

	const stringValue = value ? value.toString() : "";
	const selectedBatch = batches.find((b) => b.id.toString() === stringValue);

	return (
		<Select value={stringValue} onValueChange={(val) => onChange(Number(val))}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select Intake Batch">
					{selectedBatch
						? `${selectedBatch.name} (${selectedBatch.startYear})`
						: undefined}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{batches.map((batch) => (
					<SelectItem key={batch.id} value={batch.id.toString()}>
						{batch.name} ({batch.startYear})
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
