import { Link, useLocation } from "@tanstack/react-router";
import { FileBarChart, Pencil, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { KpiReportDownloadAction } from "./kpi-report-download-action";

export function KpiTargetHeader() {
	const location = useLocation();
	const isEditPage = location.pathname.endsWith("/edit");

	return (
		<Heading
			title="Manage KPI Target"
			description="Set your personal KPI targets and compare them with lecturer and official batch targets."
			icon={Target}
		>
			<div className="flex flex-wrap items-center gap-2">
				<Button
					type="button"
					variant="secondary"
					render={
						isEditPage ? (
							<Link to="/kpi/target" />
						) : (
							<Link to="/kpi/target/edit" />
						)
					}
					className="w-full md:w-auto"
				>
					{isEditPage ? (
						<>
							<FileBarChart className="mr-2 size-4" />
							View Report
						</>
					) : (
						<>
							<Pencil className="mr-2 size-4" />
							Edit Personal's Target
						</>
					)}
				</Button>
				{!isEditPage && <KpiReportDownloadAction />}
			</div>
		</Heading>
	);
}
