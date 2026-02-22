import type { AcademicListSearch } from "./academic-list-params";
import type { ChallengeListSearch } from "./challenge-list-params";
import type { IntakeListSearch } from "./intake-list-params";
import type { KpiRecordListSearch } from "./kpi-record-list-params";

export function mapAcademicSortColumn(
	columnId: string,
): AcademicListSearch["sortBy"] {
	if (columnId === "academicYearString") return "academicYear";
	if (columnId === "semester") return "semester";
	if (columnId === "gpa") return "gpa";
	return undefined;
}

export function mapAcademicSortToColumn(
	sortBy?: AcademicListSearch["sortBy"],
): string | undefined {
	if (!sortBy) return undefined;
	if (sortBy === "academicYear") return "academicYearString";
	return sortBy;
}

export function mapChallengeSortColumn(
	columnId: string,
): ChallengeListSearch["sortBy"] {
	if (columnId === "semester") return "semester";
	if (columnId === "challenge") return "challenge";
	return undefined;
}

export function mapKpiRecordSortColumn(
	columnId: string,
): KpiRecordListSearch["sortBy"] {
	if (columnId === "semester") return "semester";
	if (columnId === "type") return "type";
	if (columnId === "title") return "title";
	return undefined;
}

export function mapIntakeSortColumn(
	columnId: string,
): IntakeListSearch["sortBy"] {
	if (columnId === "name") return "name";
	if (columnId === "startYear") return "startYear";
	if (columnId === "isActive") return "isActive";
	return undefined;
}
