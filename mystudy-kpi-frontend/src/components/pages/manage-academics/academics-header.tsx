import { Link, useLocation } from "@tanstack/react-router";
import {
	ChartArea,
	GraduationCap,
	Plus,
	Table as TableIcon,
} from "lucide-react";
import { useCallback } from "react";
import { AcademicCreateShortSemesterForm } from "@/components/pages/manage-academics/academic-create-short-semester-form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useModal } from "@/hooks/use-modal";

export function AcademicsHeader() {
	const modal = useModal();
	const location = useLocation();
	const isAnalytics = location.pathname.endsWith("/analytics");

	const handleCreateShort = useCallback(() => {
		modal.open({
			title: "Add Short Semester",
			description:
				"Manually add a short semester (Semester 3) to your academic year.",
			Content: AcademicCreateShortSemesterForm,
			payload: {},
		});
	}, [modal]);

	return (
		<Heading
			title="Manage Academics"
			description="Track your academic roadmap and maintain your GPA records."
			icon={GraduationCap}
		>
			<div className="flex flex-wrap items-center gap-2">
				<Button
					type="button"
					variant="secondary"
					render={
						<Link
							to={isAnalytics ? "/kpi/academics" : "/kpi/academics/analytics"}
						/>
					}
					className="w-full md:w-auto"
				>
					{isAnalytics ? (
						<>
							<TableIcon className="mr-2 size-4" />
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
					onClick={handleCreateShort}
					className="w-full md:w-auto"
				>
					<Plus className="mr-2 size-4" />
					Add Short Semester
				</Button>
			</div>
		</Heading>
	);
}
