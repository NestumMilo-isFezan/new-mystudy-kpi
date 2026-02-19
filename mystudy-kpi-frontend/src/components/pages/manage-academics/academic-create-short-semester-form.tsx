import { getRouteApi } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ModalContentProps } from "@/components/modal/modal-provider";
import { useAcademicsMutations } from "@/components/pages/manage-academics/use-academics-mutations";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { NumberInput } from "@/components/ui/number-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const authRouteApi = getRouteApi("/_auth");

export function AcademicCreateShortSemesterForm({
	close,
}: ModalContentProps<unknown>) {
	const { session } = authRouteApi.useRouteContext();
	const intakeStartYear =
		session.user.intake?.startYear ?? new Date().getFullYear();

	const academicYearOptions = useMemo(() => {
		const options = [];
		for (let i = 0; i < 4; i++) {
			const year = intakeStartYear + i;
			options.push({
				value: year.toString(),
				label: `${year}/${year + 1}`,
			});
		}
		return options;
	}, [intakeStartYear]);

	const [academicYear, setAcademicYear] = useState<string>(
		academicYearOptions[0].value,
	);
	const [gpa, setGpa] = useState<number>(0);
	const { upsertMutation } = useAcademicsMutations();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		upsertMutation.mutate(
			{
				semester: 3, // Short Semester
				academicYear: Number.parseInt(academicYear, 10),
				gpa: gpa.toFixed(2),
			},
			{
				onSuccess: () => close(),
			},
		);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<Field>
				<FieldLabel>Academic Year</FieldLabel>
				<FieldContent>
					<Select
						value={academicYear}
						onValueChange={(val) => setAcademicYear(val ?? "")}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select year" />
						</SelectTrigger>
						<SelectContent>
							{academicYearOptions.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FieldContent>
			</Field>

			<Field>
				<FieldLabel>GPA</FieldLabel>
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
					disabled={upsertMutation.isPending}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={upsertMutation.isPending}>
					{upsertMutation.isPending ? "Creating..." : "Add Short Semester"}
				</Button>
			</DialogFooter>
		</form>
	);
}
