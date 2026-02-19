import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AssignStudent } from "@/components/pages/mentorship/assign-student";
import { intakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";

const assignStudentSearchSchema = z.object({
	batchId: z.coerce.number().int().positive().optional(),
	mentorshipId: z.coerce.number().int().positive().optional(),
});

export const Route = createFileRoute("/_auth/_lecturer/mentorship/assign")({
	validateSearch: (search) => assignStudentSearchSchema.parse(search),
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(intakeBatchesQueryOptions);
	},
	component: AssignStudentRoute,
});

function AssignStudentRoute() {
	const { batchId, mentorshipId } = Route.useSearch();

	return (
		<AssignStudent lockedBatchId={batchId} returnMentorshipId={mentorshipId} />
	);
}
