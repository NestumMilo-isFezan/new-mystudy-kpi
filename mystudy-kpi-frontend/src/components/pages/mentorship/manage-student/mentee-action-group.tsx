import { UserMinus } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { useMentorshipMutations } from "@/components/pages/mentorship/use-mentorship-mutations";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModal } from "@/hooks/use-modal";
import type { Student } from "@/lib/api/students.functions";

type MenteeActionGroupProps = {
	student: Student;
	variant: "card" | "cell";
};

export function MenteeActionGroup({
	student,
	variant,
}: MenteeActionGroupProps) {
	const modal = useModal();
	const { removeMenteeMutation } = useMentorshipMutations();

	const handleRemove = useCallback(() => {
		modal.open({
			title: "Remove Mentee",
			description: `Are you sure you want to remove "${student.firstName} ${student.lastName}" (${student.identifier}) from this mentorship?`,
			size: "sm",
			Content: ConfirmationModalContent,
			payload: {
				onConfirm: () => removeMenteeMutation.mutate(student.id),
				confirmLabel: "Remove",
				variant: "destructive",
				isPending: removeMenteeMutation.isPending,
			},
		});
	}, [modal, removeMenteeMutation, student]);

	return (
		<ButtonGroup className={variant === "card" ? "w-full justify-end" : ""}>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleRemove}
				className="text-destructive hover:bg-destructive/10 hover:text-destructive"
				title="Remove Mentee"
			>
				<UserMinus className="size-4" />
			</Button>
		</ButtonGroup>
	);
}
