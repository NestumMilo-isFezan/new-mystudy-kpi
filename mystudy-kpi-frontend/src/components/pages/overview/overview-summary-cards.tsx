import { Award, GraduationCap, Target, Trophy } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import type { KpiSummaryResponse } from "@/lib/api/kpi-summary.functions";

export function OverviewSummaryCards({
	summary,
}: {
	summary: KpiSummaryResponse;
}) {
	const totalActivities = Object.values(summary.actual.activities).reduce(
		(a, b) => a + b,
		0,
	);
	const totalCompetitions = Object.values(summary.actual.competitions).reduce(
		(a, b) => a + b,
		0,
	);
	const totalCerts = Object.values(summary.actual.certificates).reduce(
		(a, b) => a + b,
		0,
	);
	const totalRecords = totalActivities + totalCompetitions + totalCerts;

	const cgpaValue = summary.actual.cgpa;
	const cgpaGap = summary.gaps.cgpa;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<SummaryCard
				title="Current CGPA"
				value={cgpaValue ? parseFloat(cgpaValue).toFixed(2) : "Not Taken"}
				description="Your latest academic standing"
				icon={GraduationCap}
				trend={
					cgpaGap !== null
						? {
								value: `${cgpaGap >= 0 ? "+" : ""}${cgpaGap.toFixed(2)}`,
								isPositive: cgpaGap >= 0,
								label: "from target",
							}
						: undefined
				}
			/>
			<SummaryCard
				title="Total Records"
				value={totalRecords}
				description="Activities, competitions & certs"
				icon={Target}
			/>
			<SummaryCard
				title="Achievements"
				value={totalActivities + totalCompetitions}
				description="Events and competitions joined"
				icon={Trophy}
			/>
			<SummaryCard
				title="Certifications"
				value={totalCerts}
				description="Professional and technical certs"
				icon={Award}
			/>
		</div>
	);
}
