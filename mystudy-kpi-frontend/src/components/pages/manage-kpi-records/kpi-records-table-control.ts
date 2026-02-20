import type { TableControlConfig } from "@/components/table/core/table-config";

export function getKpiRecordsTableConfig(
	filterType?: string,
	isLecturerMentee?: boolean,
): TableControlConfig {
	return {
		query: {
			placeholder: "Search by title or description",
			desktopColumns: ["title"],
			mobileColumns: ["title"],
		},
		filters: isLecturerMentee
			? [
					{
						columnId: "type",
						label: "Type",
						placeholder: "Filter type",
						options: [
							{ label: "Activities", value: "activity" },
							{ label: "Competitions", value: "competition" },
							{ label: "Certifications", value: "certification" },
						],
					},
				]
			: [],
		sortOptions: [
			{ columnId: "semester", label: "Semester" },
			{ columnId: "type", label: "Type" },
			{ columnId: "title", label: "Title" },
		],
		columns: [
			{ columnId: "semester", label: "Semester", hideable: false },
			{
				columnId: "type",
				label: "Type",
				hideable: true,
				hiddenByDefault: filterType !== undefined,
			},
			{ columnId: "title", label: "Title", hideable: false },
			{
				columnId: "level",
				label: "Level",
				hideable: false,
				hiddenByDefault: filterType === "certification" || !filterType,
			},
			{
				columnId: "category",
				label: "Category",
				hideable: false,
				hiddenByDefault: filterType !== "certification",
			},
			{
				columnId: "achievements",
				label: "Achievements",
				hideable: false,
				hiddenByDefault: filterType !== undefined,
			},
			{ columnId: "actions", label: "Actions", hideable: false },
		],
	};
}
