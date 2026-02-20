import { Link } from "@tanstack/react-router";
import { MoreHorizontalIcon } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { IntakeEditForm } from "@/components/pages/manage-intake/intake-edit-form";
import { useIntakeMutations } from "@/components/pages/manage-intake/use-intake-mutations";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import type { IntakeBatch } from "@/lib/api/intake-batches.functions";

type IntakeActionMenuProps = {
	intake: IntakeBatch;
	variant: "card" | "cell";
};

export function IntakeActionMenu({ intake, variant }: IntakeActionMenuProps) {
	const modal = useModal();
	const { toggleStatusMutation, deleteMutation } = useIntakeMutations();

	const handleEdit = useCallback(() => {
		modal.open({
			title: "Edit Intake Batch",
			description: "Update the start year for the intake batch.",
			Content: IntakeEditForm,
			payload: intake,
		});
	}, [modal, intake]);

	const handleToggleActive = useCallback(() => {
		toggleStatusMutation.mutate(intake.id);
	}, [toggleStatusMutation, intake.id]);

	const handleDelete = useCallback(() => {
		modal.open({
			title: "Delete Intake Batch",
			description: `Are you sure you want to delete intake batch "${intake.name}"? This will nullify the intake batch for all students in this batch.`,
			size: "sm",
			Content: ConfirmationModalContent,
			payload: {
				onConfirm: () => deleteMutation.mutate(intake.id),
				confirmLabel: "Delete",
				variant: "destructive",
			},
		});
	}, [modal, deleteMutation, intake]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size={variant === "card" ? "sm" : "icon-sm"}
					/>
				}
			>
				<MoreHorizontalIcon />
				<span className="sr-only">Open intake actions</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-44">
				<DropdownMenuItem
					render={
						<Link
							to="/staff/intake/assign-kpi"
							search={{ batchId: intake.id }}
						/>
					}
				>
					Manage Targets
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
				<DropdownMenuItem onClick={handleToggleActive}>
					{intake.isActive ? "Deactivate" : "Activate"}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" onClick={handleDelete}>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
