import type { TableControlConfig } from "@/components/table/core/table-config";
import type { IntakeBatch } from "@/lib/api/intake-batches.functions";

export function getStudentTableControlConfig(
	intakeBatches: IntakeBatch[],
): TableControlConfig {
	const uniqueYears = Array.from(
		new Set(intakeBatches.map((batch) => batch.startYear)),
	).sort((a, b) => b - a);

	return {
		query: {
			placeholder: "Search by name, ID, email, or intake",
			desktopColumns: [
				"identifier",
				"fullName",
				"email",
				"intakeName",
				"startYear",
			],
			mobileColumns: ["identifier", "fullName", "intakeName"],
		},
		filters: [
			{
				columnId: "startYear",
				label: "Start Year",
				placeholder: "Filter by year",
				options: uniqueYears.map((year) => ({
					label: year.toString(),
					value: year.toString(),
				})),
			},
		],
		sortOptions: [
			{ columnId: "identifier", label: "Student ID" },
			{ columnId: "fullName", label: "Full Name" },
			{ columnId: "email", label: "Email" },
			{ columnId: "startYear", label: "Start Year" },
		],
		columns: [
			{ columnId: "identifier", label: "ID", hideable: false },
			{ columnId: "fullName", label: "Full Name", hideable: true },
			{ columnId: "email", label: "Email", hideable: true },
			{ columnId: "intakeName", label: "Intake", hideable: true },
			{
				columnId: "startYear",
				label: "Start Year",
				hideable: false,
				hiddenByDefault: true,
			},
			{ columnId: "actions", label: "Actions", hideable: false },
		],
	};
}
