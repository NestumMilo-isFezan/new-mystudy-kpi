import type { TableControlConfig } from "@/components/table/core/table-config";
import type { Lecturer } from "@/lib/api/lecturers.functions";
import type { Mentorship } from "@/lib/api/mentorships.functions";

export function getMentorshipTableControlConfig(
	mentorships: Mentorship[],
	showLecturer = false,
	allLecturers: Lecturer[] = [],
): TableControlConfig {
	const uniqueYears = Array.from(
		new Set(mentorships.map((m) => m.intakeBatch.startYear)),
	).sort((a, b) => b - a);

	const lecturerOptions =
		allLecturers.length > 0
			? allLecturers.map((l) => ({
					label: `${l.firstName} ${l.lastName}`,
					value: `${l.firstName} ${l.lastName}`,
				}))
			: Array.from(
					new Set(
						mentorships
							.map((m) =>
								m.lecturer
									? `${m.lecturer.firstName} ${m.lecturer.lastName}`
									: null,
							)
							.filter(Boolean),
					),
				)
					.sort()
					.map((name) => ({
						label: name as string,
						value: name as string,
					}));

	const filters = [
		{
			columnId: "startYear",
			label: "Start Year",
			placeholder: "Filter by year",
			options: uniqueYears.map((year) => ({
				label: year.toString(),
				value: year.toString(),
			})),
		},
	];

	if (showLecturer) {
		filters.push({
			columnId: "lecturer",
			label: "Lecturer",
			placeholder: "Filter by lecturer",
			options: lecturerOptions,
		});
	}

	return {
		query: {
			placeholder: "Search by intake batch...",
			desktopColumns: showLecturer
				? ["intakeBatchName", "startYear", "lecturer"]
				: ["intakeBatchName", "startYear"],
			mobileColumns: ["intakeBatchName"],
		},
		filters,
		sortOptions: [
			{ columnId: "intakeBatchName", label: "Intake Batch" },
			{ columnId: "startYear", label: "Start Year" },
			{ columnId: "menteeCount", label: "Mentee Count" },
			...(showLecturer ? [{ columnId: "lecturer", label: "Lecturer" }] : []),
		],
		columns: [
			{ columnId: "expander", label: "", hideable: false },
			...(showLecturer
				? [{ columnId: "lecturer", label: "Lecturer", hideable: true }]
				: []),
			{ columnId: "intakeBatchName", label: "Intake Batch", hideable: false },
			{ columnId: "startYear", label: "Start Year", hideable: true },
			{ columnId: "menteeCount", label: "Mentee Count", hideable: true },
			{ columnId: "actions", label: "Actions", hideable: false },
		],
	};
}
