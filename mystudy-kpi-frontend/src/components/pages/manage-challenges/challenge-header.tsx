import { MessageSquareQuote, Plus } from "lucide-react";
import { useCallback } from "react";
import { ChallengeForm } from "@/components/pages/manage-challenges/challenge-form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useModal } from "@/hooks/use-modal";

export function ChallengeHeader() {
	const modal = useModal();

	const handleCreate = useCallback(() => {
		modal.open({
			title: "Add Challenge Reflection",
			description:
				"Record a new semester hurdle and how you plan to overcome it.",
			Content: ChallengeForm,
			payload: undefined,
		});
	}, [modal]);

	return (
		<Heading
			title="Manage Challenges"
			description="Reflect on your semester hurdles and mitigation plans."
			icon={MessageSquareQuote}
		>
			<Button type="button" onClick={handleCreate} className="w-full md:w-auto">
				<Plus className="mr-2 size-4" />
				Add Challenge
			</Button>
		</Heading>
	);
}
