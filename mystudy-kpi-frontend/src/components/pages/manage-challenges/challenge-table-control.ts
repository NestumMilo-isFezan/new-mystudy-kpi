import type { TableControlConfig } from "@/components/table/core/table-config";

export const challengeTableControlConfig: TableControlConfig = {
	query: {
		placeholder: "Search challenges or plans",
		desktopColumns: ["challenge", "plan"],
		mobileColumns: ["challenge", "plan"],
	},
	filters: [
		{
			columnId: "semesterNumber",
			label: "Semester",
			placeholder: "Filter semester",
			options: [
				{ label: "Semester 1", value: "1" },
				{ label: "Semester 2", value: "2" },
				{ label: "Short Semester", value: "3" },
			],
		},
	],
	sortOptions: [
		{ columnId: "semester", label: "Semester" },
		{ columnId: "challenge", label: "Challenge" },
	],
	columns: [
		{ columnId: "semester", label: "Semester", hideable: false },
		{
			columnId: "semesterNumber",
			label: "Semester Number",
			hideable: true,
			hiddenByDefault: true,
		},
		{ columnId: "challenge", label: "Challenge", hideable: false },
		{ columnId: "plan", label: "Plan", hideable: true },
		{ columnId: "actions", label: "Actions", hideable: false },
	],
};
