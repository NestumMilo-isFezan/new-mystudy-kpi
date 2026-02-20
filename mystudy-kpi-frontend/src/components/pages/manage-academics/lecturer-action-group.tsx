import type { AcademicRecord } from "@/lib/api/academics-query";

type LecturerAcademicActionGroupProps = {
	record: AcademicRecord;
	variant: "card" | "cell";
};

/**
 * Lecturer action group for academic records.
 * Currently, lecturers can only view academic records.
 */
export function LecturerAcademicActionGroup({
	record: _record,
	variant: _variant,
}: LecturerAcademicActionGroupProps) {
	return null;
}
