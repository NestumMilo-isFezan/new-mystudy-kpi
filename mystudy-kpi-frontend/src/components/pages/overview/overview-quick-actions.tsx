import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Award,
	FileText,
	GraduationCap,
	MessageSquareQuote,
} from "lucide-react";
import { useCallback } from "react";
import { AcademicEditGpaForm } from "@/components/pages/manage-academics/academic-edit-gpa-form";
import { ChallengeForm } from "@/components/pages/manage-challenges/challenge-form";
import { KpiRecordForm } from "@/components/pages/manage-kpi-records/kpi-record-form";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { academicsQueryOptions } from "@/lib/api/academics-query";

export function OverviewQuickActions() {
	const modal = useModal();
	const { data: academics } = useSuspenseQuery(academicsQueryOptions);
	const latestRecord = academics[academics.length - 1];

	const handleAddRecord = useCallback(() => {
		modal.open({
			title: "Add KPI Achievement",
			description: "Record a new activity, competition, or certification.",
			Content: KpiRecordForm,
			payload: undefined,
		});
	}, [modal]);

	const handleAddChallenge = useCallback(() => {
		modal.open({
			title: "Add Challenge Reflection",
			description:
				"Record a new semester hurdle and how you plan to overcome it.",
			Content: ChallengeForm,
			payload: undefined,
		});
	}, [modal]);

	const handleUpdateGpa = useCallback(() => {
		if (!latestRecord) return;
		modal.open({
			title: "Update GPA",
			description: `Update your result for ${latestRecord.termString}.`,
			Content: AcademicEditGpaForm,
			payload: latestRecord,
		});
	}, [modal, latestRecord]);

	return (
		<div className="rounded-xl border bg-card p-6 shadow-sm">
			<h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
			<div className="grid gap-3 sm:grid-cols-2">
				<Button
					variant="outline"
					className="h-auto flex-col items-start gap-1 p-4 text-left"
					onClick={handleAddRecord}
				>
					<div className="flex w-full items-center justify-between mb-2">
						<div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
							<Award className="size-5" />
						</div>
						<ArrowRight className="size-4 text-muted-foreground" />
					</div>
					<div className="text-sm font-semibold">New KPI Record</div>
					<div className="text-xs text-muted-foreground">
						Log a new achievement
					</div>
				</Button>

				<Button
					variant="outline"
					className="h-auto flex-col items-start gap-1 p-4 text-left"
					onClick={handleAddChallenge}
				>
					<div className="flex w-full items-center justify-between mb-2">
						<div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
							<MessageSquareQuote className="size-5" />
						</div>
						<ArrowRight className="size-4 text-muted-foreground" />
					</div>
					<div className="text-sm font-semibold">New Challenge</div>
					<div className="text-xs text-muted-foreground">
						Reflect on hurdles
					</div>
				</Button>

				<Button
					variant="outline"
					className="h-auto flex-col items-start gap-1 p-4 text-left"
					onClick={handleUpdateGpa}
					disabled={!latestRecord}
				>
					<div className="flex w-full items-center justify-between mb-2">
						<div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
							<GraduationCap className="size-5" />
						</div>
						<ArrowRight className="size-4 text-muted-foreground" />
					</div>
					<div className="text-sm font-semibold">Update GPA</div>
					<div className="text-xs text-muted-foreground">
						Latest: {latestRecord?.termString ?? "Not Taken"}
					</div>
				</Button>

				<Button
					variant="outline"
					className="h-auto flex-col items-start gap-1 p-4 text-left"
					render={<Link to="/kpi/target" />}
				>
					<div className="flex w-full items-center justify-between mb-2">
						<div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
							<FileText className="size-5" />
						</div>
						<ArrowRight className="size-4 text-muted-foreground" />
					</div>
					<div className="text-sm font-semibold">Full Report</div>
					<div className="text-xs text-muted-foreground">
						View detailed analytics
					</div>
				</Button>
			</div>
		</div>
	);
}
