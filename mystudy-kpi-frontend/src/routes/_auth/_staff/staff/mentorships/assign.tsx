import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AssignStudent } from "@/components/pages/mentorship/assign-student";

const assignSearchSchema = z.object({
	batchId: z.number().int().optional(),
	mentorshipId: z.number().int().optional(),
});

export const Route = createFileRoute("/_auth/_staff/staff/mentorships/assign")({
	validateSearch: (search) => assignSearchSchema.parse(search),
	component: AdminAssignMenteePage,
});

function AdminAssignMenteePage() {
	const { batchId, mentorshipId } = Route.useSearch();

	return (
		<AssignStudent
			lockedBatchId={batchId}
			returnMentorshipId={mentorshipId}
			showLecturerSelector={true}
			rootPath="/staff/mentorships"
		/>
	);
}
