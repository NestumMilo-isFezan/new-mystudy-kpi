import type { TableControlConfig } from "@/components/table/core/table-config";

export const academicsTableControlConfig: TableControlConfig = {
	query: {
		placeholder: "Search by term or year",
		desktopColumns: ["termString", "academicYearString"],
		mobileColumns: ["termString", "academicYearString"],
	},
	filters: [
		{
			columnId: "semester",
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
		{ columnId: "academicYear", label: "Academic year" },
		{ columnId: "semester", label: "Semester" },
		{ columnId: "gpa", label: "GPA" },
	],
	columns: [
		{
			columnId: "semester",
			label: "Semester",
			hiddenByDefault: true,
			hideable: false,
		},
		{ columnId: "termString", label: "Term", hideable: false },
		{ columnId: "academicYearString", label: "Year", hideable: true },
		{ columnId: "gpa", label: "GPA", hideable: false },
		{ columnId: "actions", label: "Actions", hideable: false },
	],
};
