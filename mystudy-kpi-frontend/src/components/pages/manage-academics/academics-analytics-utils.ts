import type {
	AcademicChartDatum,
	AcademicSnapshot,
} from "@/components/pages/manage-academics/academics-analytics-types";
import type { AcademicRecord } from "@/lib/api/academics.functions";

function parseGpa(gpa: string) {
	return Number.parseFloat(gpa);
}

export function buildAcademicChartData(
	records: AcademicRecord[],
): AcademicChartDatum[] {
	return records
		.filter((record) => record.gpa !== null)
		.map((record) => ({
			name: record.termString,
			gpa: parseGpa(record.gpa as string),
			year: record.academicYearString,
			academicYear: record.academicYear,
			semester: record.semester,
		}))
		.sort((a, b) => {
			if (a.academicYear !== b.academicYear) {
				return a.academicYear - b.academicYear;
			}

			return a.semester - b.semester;
		});
}

export function buildAcademicSnapshot(
	records: AcademicRecord[],
): AcademicSnapshot {
	const chartData = buildAcademicChartData(records);

	if (!chartData.length) {
		return {
			latestGpa: 0,
			averageGpa: 0,
			totalSemesters: 0,
			topGpa: 0,
			latestTerm: null,
		};
	}

	const latestRecord = chartData[chartData.length - 1];
	const topGpa = Math.max(...chartData.map((item) => item.gpa));
	const totalGpa = chartData.reduce((total, item) => total + item.gpa, 0);

	return {
		latestGpa: latestRecord.gpa,
		averageGpa: totalGpa / chartData.length,
		totalSemesters: chartData.length,
		topGpa,
		latestTerm: latestRecord.name,
	};
}
