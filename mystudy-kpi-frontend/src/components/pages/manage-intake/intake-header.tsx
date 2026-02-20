import { useNavigate } from "@tanstack/react-router";
import { Plus, Target, Wrench } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { IntakeCreateForm } from "@/components/pages/manage-intake/intake-create-form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useModal } from "@/hooks/use-modal";

export function IntakeHeader() {
	const modal = useModal();
	const navigate = useNavigate();

	const handleCreate = useCallback(() => {
		modal.open({
			title: "Create Intake Batch",
			description:
				"Enter the start year for the new intake batch. The name will be automatically generated (e.g., 2024 becomes 24/25).",
			Content: IntakeCreateForm,
			payload: {},
		});
	}, [modal]);

	const handleAssignKpiTarget = useCallback(() => {
		modal.open({
			title: "Edit Batch KPI Target",
			description:
				"You are about to edit the standard KPI target for intake batches. Continue to the assignment page?",
			size: "sm",
			Content: ConfirmationModalContent,
			payload: {
				onConfirm: () =>
					navigate({
						to: "/staff/intake/assign-kpi",
					}),
				confirmLabel: "Continue",
			},
		});
	}, [modal, navigate]);

	return (
		<Heading
			title="Manage Intakes"
			description="Create and manage student intake batches for the system."
			icon={Wrench}
		>
			<Button
				type="button"
				variant="outline"
				onClick={handleAssignKpiTarget}
				className="w-full md:w-auto"
			>
				<Target className="mr-2 size-4" />
				Assign KPI Target
			</Button>
			<Button type="button" onClick={handleCreate} className="w-full md:w-auto">
				<Plus className="mr-2 size-4" />
				Create Intake
			</Button>
		</Heading>
	);
}
