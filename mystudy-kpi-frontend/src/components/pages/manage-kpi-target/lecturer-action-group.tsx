import type { KpiAimNode } from "@/lib/api/kpi-aim.functions";

type LecturerKpiTargetActionGroupProps = {
	record: KpiAimNode;
	variant: "card" | "cell";
};

/**
 * Lecturer action group for KPI targets.
 * Currently, lecturers can only view KPI targets.
 */
export function LecturerKpiTargetActionGroup({
	record: _record,
	variant: _variant,
}: LecturerKpiTargetActionGroupProps) {
	return null;
}
