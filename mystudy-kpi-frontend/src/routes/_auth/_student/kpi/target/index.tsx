import { createFileRoute } from "@tanstack/react-router";
import { KpiTargetReport } from "@/components/pages/manage-kpi-target/kpi-target-report";

export const Route = createFileRoute("/_auth/_student/kpi/target/")({
	component: KpiTargetReport,
});
