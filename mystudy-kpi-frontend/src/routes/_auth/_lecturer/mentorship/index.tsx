import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { MentorshipHeader } from "@/components/pages/mentorship/mentorship-header";
import { MentorshipTable } from "@/components/pages/mentorship/mentorship-table";
import { MentorshipTableSkeleton } from "@/components/pages/mentorship/mentorship-table-skeleton";
import { lecturerMentorshipsQueryOptions } from "@/lib/api/mentorships-query";

export const Route = createFileRoute("/_auth/_lecturer/mentorship/")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(lecturerMentorshipsQueryOptions),
	component: MentorshipIndex,
});

function MentorshipIndex() {
	return (
		<>
			<MentorshipHeader />
			<Suspense fallback={<MentorshipTableSkeleton />}>
				<MentorshipTable />
			</Suspense>
		</>
	);
}
