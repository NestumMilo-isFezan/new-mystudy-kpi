import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronRight, UserMinus } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { useMentorshipMutations } from "@/components/pages/mentorship/use-mentorship-mutations";
import { DataCell } from "@/components/table/data/cell";
import { HeaderCell } from "@/components/table/header/cell";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/use-modal";
import type { Mentorship } from "@/lib/api/mentorships.functions";
import type { Student } from "@/lib/api/students.functions";

type MenteeSubTableProps = {
	mentorship: Mentorship;
	rootPath?: string;
};

export function MenteeSubTable({
	mentorship,
	rootPath = "/mentorship",
}: MenteeSubTableProps) {
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

	const displayedMentees = mentorship.mentees.slice(0, 5);

	return (
		<div className="bg-muted/10 px-4 py-3 border-l-2 border-primary/20">
			<Table>
				<TableHeader className="bg-transparent border-b border-border">
					<TableRow className="hover:bg-transparent border-b border-border">
						<TableHead className="h-8">
							<HeaderCell>Student ID</HeaderCell>
						</TableHead>
						<TableHead className="h-8">
							<HeaderCell>Full Name</HeaderCell>
						</TableHead>
						<TableHead className="h-8">
							<HeaderCell>Email</HeaderCell>
						</TableHead>
						<TableHead className="h-8 text-right">
							<HeaderCell className="justify-end">Action</HeaderCell>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{displayedMentees.length > 0 ? (
						displayedMentees.map((student) => (
							<TableRow
								key={student.id}
								className="hover:bg-muted/20 border-b border-border last:border-0"
							>
								<TableCell className="py-2">
									<DataCell
										value={student.identifier}
										className="font-mono text-xs"
									/>
								</TableCell>
								<TableCell className="py-2">
									<DataCell
										value={`${student.firstName} ${student.lastName}`}
										className="text-sm"
									/>
								</TableCell>
								<TableCell className="py-2">
									<DataCell
										value={student.email}
										className="text-sm text-muted-foreground"
									/>
								</TableCell>
								<TableCell className="py-2 text-right">
									<Button
										variant="ghost"
										size="icon-sm"
										className="h-7 w-7 text-muted-foreground hover:text-destructive"
										onClick={() => handleRemoveMentee(student)}
										title="Remove mentee"
									>
										<UserMinus className="h-3.5 w-3.5" />
									</Button>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={4}
								className="py-8 text-center text-sm text-muted-foreground"
							>
								No students assigned in this mentorship yet.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
				<TableFooter className="bg-transparent border-t border-border">
					<TableRow className="hover:bg-muted/30 transition-colors">
						<TableCell colSpan={4} className="p-0">
							<Link
								to={`${rootPath}/${String(mentorship.id)}` as LinkProps["to"]}
								className="flex items-center justify-center py-2 text-xs font-semibold text-primary gap-1"
							>
								View All {mentorship.menteeCount} Mentees
								<ChevronRight className="h-3 w-3" />
							</Link>
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
}
