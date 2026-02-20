import {
	type UseSuspenseQueryOptions,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { KpiAimNode, KpiAimResponse } from "@/lib/api/kpi-aim.functions";
import { kpiAimQueryOptions } from "@/lib/api/kpi-aim-query";
import { cn } from "@/lib/utils";

const levelKeys = [
	"faculty",
	"university",
	"local",
	"national",
	"international",
] as const;
const certificateKeys = ["professional", "technical"] as const;

type ComparisonRow =
	| { kind: "section"; label: string }
	| {
			kind: "metric";
			label: string;
			personal: string;
			lecturer: string;
			batch: string;
			actual: string;
	  };

type KpiTargetReportProps = {
	queryOptions?: unknown;
};

export function KpiTargetReport({
	queryOptions: customQueryOptions = kpiAimQueryOptions,
}: KpiTargetReportProps) {
	const { data } = useSuspenseQuery(
		customQueryOptions as UseSuspenseQueryOptions<KpiAimResponse>,
	);

	const rows = buildComparisonRows(data);
	const evaluation = buildEvaluation(data);

	return (
		<div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-background">
			<Table className="w-full border-hidden text-sm">
				<TableHeader className="bg-emerald-50/60 border-b border-slate-200">
					<TableRow className="hover:bg-transparent border-0">
						<TableHead className="h-auto border-r border-slate-200/60 px-4 py-3 font-semibold text-emerald-700">
							Metric
						</TableHead>
						<TableHead className="h-auto border-r border-slate-200/60 px-4 py-3 font-semibold text-sky-700 text-right">
							Personal
						</TableHead>
						<TableHead className="h-auto border-r border-slate-200/60 px-4 py-3 font-semibold text-violet-700 text-right">
							Lecturer
						</TableHead>
						<TableHead className="h-auto border-r border-slate-200/60 px-4 py-3 font-semibold text-amber-700 text-right">
							Official Batch
						</TableHead>
						<TableHead className="h-auto border-0 px-4 py-3 font-semibold text-emerald-700 text-right">
							Actual
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="[&_tr:last-child]:border-0">
					{rows.map((row) =>
						"section" === row.kind ? (
							<TableRow
								key={row.label}
								className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200"
							>
								<TableCell
									className="px-4 py-2 text-center font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80"
									colSpan={5}
								>
									{row.label}
								</TableCell>
							</TableRow>
						) : (
							<TableRow
								key={row.label}
								className="even:bg-slate-50/30 border-b border-slate-100 last:border-0"
							>
								<TableCell className="border-r border-slate-100 px-4 py-2.5 font-medium">
									{row.label}
								</TableCell>
								<TableCell className="border-r border-slate-100 px-4 py-2.5 text-sky-700 text-right">
									{row.personal}
								</TableCell>
								<TableCell className="border-r border-slate-100 px-4 py-2.5 text-violet-700 text-right">
									{row.lecturer}
								</TableCell>
								<TableCell className="border-r border-slate-100 px-4 py-2.5 text-amber-700 text-right">
									{row.batch}
								</TableCell>
								<TableCell className="px-4 py-2.5 font-semibold text-emerald-700 text-right">
									{row.actual}
								</TableCell>
							</TableRow>
						),
					)}
					<TableRow className="bg-slate-100/50 hover:bg-slate-100/50 border-y border-slate-200">
						<TableCell
							className="px-4 py-2.5 text-center font-bold uppercase tracking-wider text-slate-600"
							colSpan={5}
						>
							Evaluations
						</TableCell>
					</TableRow>{" "}
					<TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-0">
						<TableCell className="border-r border-slate-100 px-4 py-3" />
						<TableCell
							className={cn(
								"border-r border-slate-100 px-4 py-3 font-medium text-right",
								evaluation.personalClass,
							)}
						>
							{evaluation.personalStatus}
						</TableCell>
						<TableCell
							className={cn(
								"border-r border-slate-100 px-4 py-3 font-medium text-right",
								evaluation.lecturerClass,
							)}
						>
							{evaluation.lecturerStatus}
						</TableCell>
						<TableCell
							className={cn(
								"border-r border-slate-100 px-4 py-3 font-medium text-right",
								evaluation.batchClass,
							)}
						>
							{evaluation.batchStatus}
						</TableCell>
						<TableCell className="px-4 py-3 font-semibold text-emerald-700 text-right">
							{evaluation.percentageLabel}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}

function buildComparisonRows(data: KpiAimResponse): ComparisonRow[] {
	const rows: ComparisonRow[] = [
		{ kind: "section", label: "Academics" },
		{
			kind: "metric",
			label: "CGPA",
			personal: data.personal?.cgpa ?? "-",
			lecturer: data.lecturer?.cgpa ?? "-",
			batch: data.batch?.cgpa ?? "-",
			actual: data.actual.cgpa ?? "-",
		},
		{ kind: "section", label: "Activities" },
	];

	for (const key of levelKeys) {
		rows.push({
			kind: "metric",
			label: toTitle(key),
			personal: String(data.personal?.activities[key] ?? "-"),
			lecturer: String(data.lecturer?.activities[key] ?? "-"),
			batch: String(data.batch?.activities[key] ?? "-"),
			actual: String(data.actual.activities[key] ?? 0),
		});
	}

	rows.push({ kind: "section", label: "Competitions" });

	for (const key of levelKeys) {
		rows.push({
			kind: "metric",
			label: toTitle(key),
			personal: String(data.personal?.competitions[key] ?? "-"),
			lecturer: String(data.lecturer?.competitions[key] ?? "-"),
			batch: String(data.batch?.competitions[key] ?? "-"),
			actual: String(data.actual.competitions[key] ?? 0),
		});
	}

	rows.push({ kind: "section", label: "Certificates" });

	for (const key of certificateKeys) {
		rows.push({
			kind: "metric",
			label: toTitle(key),
			personal: String(data.personal?.certificates[key] ?? "-"),
			lecturer: String(data.lecturer?.certificates[key] ?? "-"),
			batch: String(data.batch?.certificates[key] ?? "-"),
			actual: String(data.actual.certificates[key] ?? 0),
		});
	}

	return rows;
}

function buildEvaluation(data: KpiAimResponse) {
	const personalMet = data.personal
		? doesActualMeetTarget(data.actual, data.personal)
		: false;
	const lecturerMet = data.lecturer
		? doesActualMeetTarget(data.actual, data.lecturer)
		: false;
	const batchMet = data.batch
		? doesActualMeetTarget(data.actual, data.batch)
		: false;

	const achievedCount = [personalMet, lecturerMet, batchMet].filter(
		Boolean,
	).length;
	const percentage = ((achievedCount / 3) * 100).toFixed(2);

	return {
		personalStatus: data.personal ? (personalMet ? "Achieved" : "Failed") : "-",
		lecturerStatus: data.lecturer ? (lecturerMet ? "Achieved" : "Failed") : "-",
		batchStatus: data.batch ? (batchMet ? "Achieved" : "Failed") : "-",
		personalClass: !data.personal
			? "text-muted-foreground"
			: personalMet
				? "text-emerald-600"
				: "text-red-600",
		lecturerClass: !data.lecturer
			? "text-muted-foreground"
			: lecturerMet
				? "text-emerald-600"
				: "text-red-600",
		batchClass: !data.batch
			? "text-muted-foreground"
			: batchMet
				? "text-emerald-600"
				: "text-red-600",
		percentageLabel: `${percentage}% (${achievedCount}/3 x 100%)`,
	};
}

function doesActualMeetTarget(
	actual: KpiAimResponse["actual"],
	target: Pick<
		KpiAimNode,
		"cgpa" | "activities" | "competitions" | "certificates"
	>,
) {
	if (
		(Number.parseFloat(actual.cgpa ?? "0") || 0) <
		Number.parseFloat(target.cgpa)
	) {
		return false;
	}

	for (const key of levelKeys) {
		if (actual.activities[key] < target.activities[key]) {
			return false;
		}
		if (actual.competitions[key] < target.competitions[key]) {
			return false;
		}
	}

	for (const key of certificateKeys) {
		if (actual.certificates[key] < target.certificates[key]) {
			return false;
		}
	}

	return true;
}

function toTitle(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
