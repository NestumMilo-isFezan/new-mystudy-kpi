import { type LinkProps, useNavigate } from "@tanstack/react-router";
import { Eye, UserMinus } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { useMentorshipDetailContext } from "@/components/pages/mentorship/manage-student/mentorship-detail-context";
import { useMentorshipMutations } from "@/components/pages/mentorship/use-mentorship-mutations";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModal } from "@/hooks/use-modal";
import type { Student } from "@/lib/api/students.functions";

type MenteeActionGroupProps = {
	student: Student;
	variant: "card" | "cell";
	rootPath?: string;
};

export function MenteeActionGroup({
	student,
	variant,
	rootPath = "/mentorship",
}: MenteeActionGroupProps) {
	const modal = useModal();
	const navigate = useNavigate();
	const { removeMenteeMutation, removeMenteeAdminMutation } =
		useMentorshipMutations();
	const mentorshipDetailContext = useMentorshipDetailContext();

	const handleView = useCallback(() => {
		navigate({
			to: `${rootPath as string}/${student.id}` as LinkProps["to"],
		});
	}, [navigate, student.id, rootPath]);

	const handleRemove = useCallback(() => {
		const isAdminRoot = String(rootPath).startsWith("/staff");
		const activeMutation = isAdminRoot
			? removeMenteeAdminMutation
			: removeMenteeMutation;
		const isDetailMode = mentorshipDetailContext !== null;

		modal.open({
			title: "Remove Mentee",
			description: `Are you sure you want to remove "${student.firstName} ${student.lastName}" (${student.identifier}) from this mentorship?`,
			size: "sm",
			Content: ConfirmationModalContent,
			payload: {
				onConfirm: async () => {
					if (isDetailMode) {
						await mentorshipDetailContext.onRemoveMentee(student.id);
						return;
					}

					await activeMutation.mutateAsync(student.id);
				},
				confirmLabel: "Remove",
				variant: "destructive",
				isPending: isDetailMode
					? mentorshipDetailContext.isRemoving
					: activeMutation.isPending,
			},
		});
	}, [
		mentorshipDetailContext,
		modal,
		removeMenteeAdminMutation,
		removeMenteeMutation,
		rootPath,
		student,
	]);

	return (
		<ButtonGroup className={variant === "card" ? "w-full justify-end" : ""}>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleView}
				title="View Student KPI"
			>
				<Eye className="size-4" />
			</Button>
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
