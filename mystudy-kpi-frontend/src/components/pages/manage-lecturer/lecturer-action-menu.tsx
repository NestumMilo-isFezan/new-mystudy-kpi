import { MoreHorizontalIcon } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { LecturerEditForm } from "@/components/pages/manage-lecturer/lecturer-edit-form";
import { useLecturerMutations } from "@/components/pages/manage-lecturer/use-lecturer-mutations";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import type { Lecturer } from "@/lib/api/lecturers.functions";

type LecturerActionMenuProps = {
	lecturer: Lecturer;
	variant: "card" | "cell";
};

export function LecturerActionMenu({
	lecturer,
	variant,
}: LecturerActionMenuProps) {
	const modal = useModal();
	const { deleteMutation } = useLecturerMutations();

	const handleEdit = useCallback(() => {
		modal.open({
			title: "Edit Lecturer Account",
			description: "Update the account details for the lecturer.",
			Content: LecturerEditForm,
			payload: lecturer,
		});
	}, [modal, lecturer]);

	const handleDelete = useCallback(() => {
		modal.open({
			title: "Delete Lecturer Account",
			description: `Are you sure you want to delete the account for "${lecturer.firstName} ${lecturer.lastName}" (${lecturer.identifier})? This action cannot be undone.`,
			size: "sm",
			Content: ConfirmationModalContent,
			payload: {
				onConfirm: () => deleteMutation.mutate(lecturer.id),
				confirmLabel: "Delete",
				variant: "destructive",
			},
		});
	}, [modal, deleteMutation, lecturer]);

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
				<span className="sr-only">Open lecturer actions</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-44">
				<DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" onClick={handleDelete}>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
