import { Pencil, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { ChallengeForm } from "@/components/pages/manage-challenges/challenge-form";
import { useChallengeMutations } from "@/components/pages/manage-challenges/use-challenge-mutations";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModal } from "@/hooks/use-modal";
import type { Challenge } from "@/lib/api/challenges.functions";

type ChallengeActionGroupProps = {
	challenge: Challenge;
	variant: "card" | "cell";
};

export function ChallengeActionGroup({
	challenge,
	variant,
}: ChallengeActionGroupProps) {
	const modal = useModal();
	const { deleteMutation } = useChallengeMutations();

	const handleEdit = useCallback(() => {
		modal.open({
			title: "Edit Challenge",
			description: "Update the details of your semester hurdle and plan.",
			Content: ChallengeForm,
			payload: challenge,
		});
	}, [modal, challenge]);

	const handleDelete = useCallback(() => {
		modal.open({
			title: "Delete Challenge",
			description:
				"Are you sure you want to delete this challenge? This action cannot be undone.",
			size: "sm",
			Content: ConfirmationModalContent,
			payload: {
				onConfirm: () => deleteMutation.mutate(challenge.id),
				confirmLabel: "Delete",
				variant: "destructive",
				isPending: deleteMutation.isPending,
			},
		});
	}, [modal, challenge, deleteMutation]);

	return (
		<ButtonGroup className={variant === "card" ? "w-full justify-end" : ""}>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleEdit}
				title="Edit Challenge"
			>
				<Pencil className="size-4" />
			</Button>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleDelete}
				className="text-destructive hover:bg-destructive/10 hover:text-destructive"
				title="Delete Challenge"
			>
				<Trash2 className="size-4" />
			</Button>
		</ButtonGroup>
	);
}
