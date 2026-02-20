import { useNavigate } from "@tanstack/react-router";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { StudentEditForm } from "@/components/pages/manage-student/student-edit-form";
import { useStudentMutations } from "@/components/pages/manage-student/use-student-mutations";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModal } from "@/hooks/use-modal";
import type { Student } from "@/lib/api/students.functions";

type StudentActionGroupProps = {
	student: Student;
	variant: "card" | "cell";
};

export function StudentActionGroup({
	student,
	variant,
}: StudentActionGroupProps) {
	const modal = useModal();
	const navigate = useNavigate();
	const { deleteMutation } = useStudentMutations();

	const handleView = useCallback(() => {
		navigate({
			to: "/staff/students/$id",
			params: { id: student.id },
		});
	}, [navigate, student.id]);

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
		<ButtonGroup className={variant === "card" ? "w-full justify-end" : ""}>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleView}
				title="View Student Progress"
			>
				<Eye className="size-4" />
			</Button>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleEdit}
				title="Edit Student"
			>
				<Pencil className="size-4" />
			</Button>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleDelete}
				className="text-destructive hover:bg-destructive/10 hover:text-destructive"
				title="Delete Student"
			>
				<Trash2 className="size-4" />
			</Button>
		</ButtonGroup>
	);
}
