import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { intakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";

type StudentIdInputProps = {
	value: string;
	onChange: (value: string) => void;
	intakeBatchId: number;
	required?: boolean;
	placeholder?: string;
};

export function StudentIdInput({
	value,
	onChange,
	intakeBatchId,
	required,
	placeholder = "001",
}: StudentIdInputProps) {
	const { data: batches } = useSuspenseQuery(intakeBatchesQueryOptions);

	const prefix = useMemo(() => {
		const batch = batches.find((b) => b.id === intakeBatchId);
		if (!batch) return "BIXX";
		const shortYear = batch.startYear.toString().slice(-2);
		return `BI${shortYear}`;
	}, [batches, intakeBatchId]);

	const manualPart = useMemo(() => {
		if (value.startsWith(prefix)) {
			return value.slice(prefix.length);
		}
		return "";
	}, [value, prefix]);

	const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newManualPart = e.target.value.toUpperCase();
		onChange(`${prefix}${newManualPart}`);
	};

	return (
		<InputGroup>
			<InputGroupAddon className="bg-muted/50 border-r px-3 font-mono">
				{prefix}
			</InputGroupAddon>
			<InputGroupInput
				value={manualPart}
				onChange={handleManualChange}
				required={required}
				placeholder={placeholder}
				className="font-mono"
			/>
		</InputGroup>
	);
}
