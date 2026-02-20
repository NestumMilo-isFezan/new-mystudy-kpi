import type { LinkProps } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { MentorshipHeader } from "@/components/pages/mentorship/mentorship-header";
import { Button } from "@/components/ui/button";
import {
	AssignStudentProvider,
	SelectorPanel,
	StudentListPanel,
	useAssignStudentContext,
} from "./assign-student/index";

type AssignStudentProps = {
	lockedBatchId?: number;
	returnMentorshipId?: number;
	showLecturerSelector?: boolean;
	rootPath?: LinkProps["to"];
};

function AssignStudentContent({ rootPath }: { rootPath: LinkProps["to"] }) {
	const {
		onCreateStudent,
		selectedCount,
		isPending,
		isAssignDisabled,
		onAssign,
	} = useAssignStudentContext();

	return (
		<div className="flex flex-col gap-10 max-w-7xl mx-auto px-1 lg:px-4 pb-24 lg:pb-12">
			<MentorshipHeader
				mode="assign"
				onActionClick={onCreateStudent}
				rootPath={rootPath}
			/>

			<div className="flex flex-col lg:flex-row gap-12 items-start">
				<SelectorPanel />
				<StudentListPanel />
			</div>

			{selectedCount > 0 && (
				<div className="fixed bottom-0 inset-x-0 z-50 lg:hidden px-4 pb-8 pt-10 pointer-events-none bg-gradient-to-t from-background via-background/80 to-transparent">
					<div className="pointer-events-auto max-w-sm mx-auto animate-in slide-in-from-bottom-full duration-500 ease-in-out">
						<Button
							size="lg"
							className="w-full h-14 rounded-2xl shadow-2xl shadow-primary/30 font-bold text-lg gap-2 flex items-center justify-center"
							onClick={onAssign}
							disabled={isAssignDisabled}
						>
							{isPending ? (
								<Loader2 className="h-5 w-5 animate-spin" />
							) : (
								<>
									Assign {selectedCount} Student
									{selectedCount === 1 ? "" : "s"}
								</>
							)}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

export function AssignStudent({
	lockedBatchId,
	returnMentorshipId,
	showLecturerSelector = false,
	rootPath = "/mentorship",
}: AssignStudentProps) {
	return (
		<AssignStudentProvider
			lockedBatchId={lockedBatchId}
			returnMentorshipId={returnMentorshipId}
			showLecturerSelector={showLecturerSelector}
			rootPath={rootPath}
		>
			<AssignStudentContent rootPath={rootPath} />
		</AssignStudentProvider>
	);
}
