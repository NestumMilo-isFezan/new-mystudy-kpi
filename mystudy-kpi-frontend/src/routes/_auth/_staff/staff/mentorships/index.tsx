import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { MentorshipHeader } from "@/components/pages/mentorship/mentorship-header";
import { MentorshipTable } from "@/components/pages/mentorship/mentorship-table";
import { MentorshipTableSkeleton } from "@/components/pages/mentorship/mentorship-table-skeleton";
import { adminMentorshipsQueryOptions } from "@/lib/api/mentorships-query";

export const Route = createFileRoute("/_auth/_staff/staff/mentorships/")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(adminMentorshipsQueryOptions),
	component: AdminMentorshipIndex,
});

function AdminMentorshipIndex() {
	return (
		<>
			<MentorshipHeader
				title="All Mentorships"
				description="Monitor and manage mentorship pairings across the entire faculty."
				rootPath="/staff/mentorships"
			/>
			<Suspense fallback={<MentorshipTableSkeleton />}>
				<MentorshipTable
					queryOptions={adminMentorshipsQueryOptions}
					showLecturer={true}
					rootPath="/staff/mentorships"
				/>
			</Suspense>
		</>
	);
}
