import { createFileRoute } from "@tanstack/react-router";
import { KpiTargetForm } from "@/components/pages/manage-kpi-target/kpi-target-form";

export const Route = createFileRoute("/_auth/_student/kpi/target/edit")({
	component: KpiTargetForm,
});
