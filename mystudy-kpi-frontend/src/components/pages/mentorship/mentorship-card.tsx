import { ChevronDown, ChevronRight, UserMinus } from "lucide-react";
import { useCallback, useState } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { MentorshipActionGroup } from "@/components/pages/mentorship/mentorship-action-group";
import { useMentorshipMutations } from "@/components/pages/mentorship/use-mentorship-mutations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import type { Mentorship } from "@/lib/api/mentorships.functions";
import type { Student } from "@/lib/api/students.functions";

type MentorshipCardProps = {
	mentorship: Mentorship;
	rootPath?: string;
};

export function MentorshipCard({
	mentorship,
	rootPath = "/mentorship",
}: MentorshipCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const modal = useModal();
	const { removeMenteeMutation, removeMenteeAdminMutation } =
		useMentorshipMutations();
	const activeMutation = String(rootPath).startsWith("/staff")
		? removeMenteeAdminMutation
		: removeMenteeMutation;

	const handleRemoveMentee = useCallback(
		(student: Student) => {
			modal.open({
				title: "Remove Mentee",
				description: `Are you sure you want to remove "${student.firstName} ${student.lastName}" (${student.identifier}) from your mentorship?`,
				size: "sm",
				Content: ConfirmationModalContent,
				payload: {
					onConfirm: () => activeMutation.mutate(student.id),
					confirmLabel: "Remove",
					variant: "destructive",
					isPending: activeMutation.isPending,
				},
			});
		},
		[activeMutation, modal],
	);

	return (
		<div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/10"
			>
				<div className="space-y-1">
					<p className="font-medium text-foreground">
						{mentorship.intakeBatch.name}
					</p>
					<p className="text-xs text-muted-foreground">
						Start Year: {mentorship.intakeBatch.startYear}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="font-mono">
						{mentorship.menteeCount}
					</Badge>
					{isExpanded ? (
						<ChevronDown className="h-4 w-4 text-muted-foreground" />
					) : (
						<ChevronRight className="h-4 w-4 text-muted-foreground" />
					)}
				</div>
			</button>

			<div className="border-t border-border px-4 py-3">
				<MentorshipActionGroup mentorship={mentorship} variant="card" />
			</div>

			{isExpanded ? (
				<div className="space-y-2 border-t border-border bg-muted/10 p-3">
					{mentorship.mentees.length > 0 ? (
						mentorship.mentees.map((student) => (
							<div
								key={student.id}
								className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2"
							>
								<div className="min-w-0 text-sm">
									<p className="truncate font-medium text-foreground">{`${student.firstName} ${student.lastName}`}</p>
									<p className="truncate text-xs text-muted-foreground">
										{student.identifier} - {student.email}
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon-sm"
									className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
									onClick={() => handleRemoveMentee(student)}
									title="Remove mentee"
								>
									<UserMinus className="h-3.5 w-3.5" />
								</Button>
							</div>
						))
					) : (
						<p className="py-2 text-center text-xs text-muted-foreground">
							No mentees assigned yet.
						</p>
					)}
				</div>
			) : null}
		</div>
	);
}
