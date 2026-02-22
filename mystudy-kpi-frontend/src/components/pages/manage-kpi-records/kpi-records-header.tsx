import { Link, useLocation } from "@tanstack/react-router";
import { ChartArea, Plus, Trophy } from "lucide-react";
import { useCallback } from "react";
import { KpiRecordForm } from "@/components/pages/manage-kpi-records/kpi-record-form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useModal } from "@/hooks/use-modal";

export function KpiRecordsHeader() {
	const modal = useModal();
	const location = useLocation();
	const isAnalytics = location.pathname.endsWith("/analytics");

	const handleCreate = useCallback(() => {
		modal.open({
			title: "Add KPI Achievement",
			description: "Record a new activity, competition, or certification.",
			Content: KpiRecordForm,
			payload: undefined,
		});
	}, [modal]);

	return (
		<Heading
			title="KPI Achievements"
			description="Manage your activities, competitions, and certifications."
			icon={Trophy}
		>
			<div className="flex flex-wrap items-center gap-2">
				<Button
					type="button"
					variant="secondary"
						render={
						isAnalytics ? (
							<Link
								to="/kpi/records"
								search={{ page: 1, limit: 25 }}
							/>
						) : (
							<Link
								to="/kpi/records/analytics"
								search={{ page: 1, limit: 25 }}
							/>
						)
					}
					className="w-full md:w-auto"
				>
					{isAnalytics ? (
						<>
							<Trophy className="mr-2 size-4" />
							View Records
						</>
					) : (
						<>
							<ChartArea className="mr-2 size-4" />
							View Analytics
						</>
					)}
				</Button>
				<Button
					type="button"
					onClick={handleCreate}
					className="w-full md:w-auto"
				>
					<Plus className="mr-2 size-4" />
					Add Record
				</Button>
			</div>
		</Heading>
	);
}
