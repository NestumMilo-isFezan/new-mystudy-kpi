import { MoreHorizontalIcon } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { StudentEditForm } from "@/components/pages/manage-student/student-edit-form";
import { useStudentMutations } from "@/components/pages/manage-student/use-student-mutations";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import type { Student } from "@/lib/api/students.functions";

type StudentActionMenuProps = {
	student: Student;
	variant: "card" | "cell";
};

export function StudentActionMenu({
	student,
	variant,
}: StudentActionMenuProps) {
	const modal = useModal();
	const { deleteMutation } = useStudentMutations();

	const handleEdit = useCallback(() => {
		modal.open({
			title: "Edit Student Account",
			description:
				"Update the account details or intake batch for the student.",
			Content: StudentEditForm,
			payload: student,
		});
	}, [modal, student]);

	const handleDelete = useCallback(() => {
		modal.open({
			title: "Delete Student Account",
			description: `Are you sure you want to delete the account for "${student.firstName} ${student.lastName}" (${student.identifier})? This action cannot be undone.`,
			size: "sm",
			Content: ConfirmationModalContent,
			payload: {
				onConfirm: () => deleteMutation.mutate(student.id),
				confirmLabel: "Delete",
				variant: "destructive",
			},
		});
	}, [modal, deleteMutation, student]);

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
				<span className="sr-only">Open student actions</span>
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
