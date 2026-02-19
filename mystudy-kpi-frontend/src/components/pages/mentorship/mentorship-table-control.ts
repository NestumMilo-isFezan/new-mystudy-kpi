import type { TableControlConfig } from "@/components/table/core/table-config";
import type { Mentorship } from "@/lib/api/mentorships.functions";

export function getMentorshipTableControlConfig(
	mentorships: Mentorship[],
): TableControlConfig {
	const uniqueYears = Array.from(
		new Set(mentorships.map((m) => m.intakeBatch.startYear)),
	).sort((a, b) => b - a);

	return {
		query: {
			placeholder: "Search by intake batch...",
			desktopColumns: ["intakeBatchName", "startYear"],
			mobileColumns: ["intakeBatchName"],
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
			{ columnId: "intakeBatchName", label: "Intake Batch" },
			{ columnId: "startYear", label: "Start Year" },
			{ columnId: "menteeCount", label: "Mentee Count" },
		],
		columns: [
			{ columnId: "expander", label: "", hideable: false },
			{ columnId: "intakeBatchName", label: "Intake Batch", hideable: false },
			{ columnId: "startYear", label: "Start Year", hideable: true },
			{ columnId: "menteeCount", label: "Mentee Count", hideable: true },
			{ columnId: "actions", label: "Actions", hideable: false },
		],
	};
}
