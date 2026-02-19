import { useNavigate } from "@tanstack/react-router";
import { CircleArrowOutUpRight, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { useMentorshipMutations } from "@/components/pages/mentorship/use-mentorship-mutations";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModal } from "@/hooks/use-modal";
import type { Mentorship } from "@/lib/api/mentorships.functions";

type MentorshipActionGroupProps = {
	mentorship: Mentorship;
	variant: "card" | "cell";
};

export function MentorshipActionGroup({
	mentorship,
	variant,
}: MentorshipActionGroupProps) {
	const modal = useModal();
	const navigate = useNavigate();
	const { deleteMentorshipMutation } = useMentorshipMutations();

	const handleManage = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			navigate({
				to: "/mentorship/$mentorshipId",
				params: { mentorshipId: String(mentorship.id) },
			});
		},
		[navigate, mentorship.id],
	);

	const handleDelete = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			modal.open({
				title: "Delete Mentorship Record",
				description: `Are you sure you want to remove all mentees from the "${mentorship.intakeBatch.name}" batch? This will not delete the student accounts.`,
				size: "sm",
				Content: ConfirmationModalContent,
				payload: {
					onConfirm: () => deleteMentorshipMutation.mutate(mentorship.id),
					confirmLabel: "Delete",
					variant: "destructive",
					isPending: deleteMentorshipMutation.isPending,
				},
			});
		},
		[modal, deleteMentorshipMutation, mentorship],
	);

	return (
		<ButtonGroup className={variant === "card" ? "w-full justify-end" : ""}>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleManage}
				title="Manage Mentorship"
			>
				<CircleArrowOutUpRight className="size-4" />
			</Button>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleDelete}
				className="text-destructive hover:bg-destructive/10 hover:text-destructive"
				title="Delete Mentorship"
			>
				<Trash2 className="size-4" />
			</Button>
		</ButtonGroup>
	);
}
