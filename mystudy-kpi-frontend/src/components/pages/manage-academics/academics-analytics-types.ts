import type { AcademicRecord } from "@/lib/api/academics.functions";

export type AcademicChartDatum = {
	name: string;
	gpa: number;
	year: string;
	academicYear: number;
	semester: number;
};

export type AcademicSnapshot = {
	latestGpa: number;
	averageGpa: number;
	totalSemesters: number;
	topGpa: number;
	latestTerm: AcademicRecord["termString"] | null;
};
