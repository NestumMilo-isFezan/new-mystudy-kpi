import type { TableControlConfig } from "@/components/table/core/table-config";

export const challengeTableControlConfig: TableControlConfig = {
	query: {
		placeholder: "Search challenges or plans",
		desktopColumns: ["challenge", "plan"],
		mobileColumns: ["challenge", "plan"],
	},
	filters: [],
	sortOptions: [
		{ columnId: "semester", label: "Semester" },
		{ columnId: "challenge", label: "Challenge" },
	],
	columns: [
		{ columnId: "semester", label: "Semester", hideable: false },
		{ columnId: "challenge", label: "Challenge", hideable: false },
		{ columnId: "plan", label: "Plan", hideable: true },
		{ columnId: "actions", label: "Actions", hideable: false },
	],
};
