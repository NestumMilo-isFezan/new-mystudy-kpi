import type { TableControlConfig } from "@/components/table/core/table-config";

export const intakeTableControlConfig: TableControlConfig = {
	query: {
		placeholder: "Search by intake name or start year",
		desktopColumns: ["name", "startYear"],
		mobileColumns: ["name", "startYear"],
	},
	filters: [
		{
			columnId: "isActive",
			label: "Status",
			placeholder: "Filter status",
			options: [
				{ label: "Active", value: "active" },
				{ label: "Inactive", value: "inactive" },
			],
		},
	],
	sortOptions: [
		{ columnId: "name", label: "Intake name" },
		{ columnId: "startYear", label: "Start year" },
		{ columnId: "isActive", label: "Status" },
	],
	columns: [
		{ columnId: "name", label: "Intake", hideable: false },
		{ columnId: "startYear", label: "Start year", hideable: true },
		{ columnId: "isActive", label: "Status", hideable: true },
		{ columnId: "actions", label: "Actions", hideable: false },
	],
};
