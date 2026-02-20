import type { KpiRecord } from "@/lib/api/kpi-records-query";

type LecturerKpiRecordActionGroupProps = {
	record: KpiRecord;
	variant: "card" | "cell";
};

/**
 * Lecturer action group for KPI records.
 * Currently, lecturers can only view KPI records.
 */
export function LecturerKpiRecordActionGroup({
	record: _record,
	variant: _variant,
}: LecturerKpiRecordActionGroupProps) {
	return null;
}
