import { Link, useNavigate } from "@tanstack/react-router";
import { MenteeHeader } from "@/components/pages/mentorship/manage-student/mentee-header";
import { MenteeTable } from "@/components/pages/mentorship/manage-student/mentee-table";
import { MentorshipHeader } from "@/components/pages/mentorship/mentorship-header";
import { buttonVariants } from "@/components/ui/button";
import { useMentorshipById } from "@/lib/api/mentorships-query";

type ManageMentorshipProps = {
	mentorshipId: number;
};

const MAX_MENTEES_PER_MENTORSHIP = 5;

export function ManageMentorship({ mentorshipId }: ManageMentorshipProps) {
	const mentorship = useMentorshipById(mentorshipId);
	const navigate = useNavigate();

	const handleAssignClick = () => {
		if (!mentorship) return;
		navigate({
			to: "/mentorship/assign",
			search: {
				batchId: mentorship.intakeBatch.id,
				mentorshipId: mentorship.id,
			},
		});
	};

	if (!mentorship) {
		return (
			<div className="space-y-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm">
				<p className="text-lg font-semibold text-foreground">
					Mentorship record not found
				</p>
				<p className="text-sm text-muted-foreground">
					The mentorship might have been deleted or you no longer have access.
				</p>
				<Link
					to="/mentorship"
					className={buttonVariants({ variant: "default" })}
				>
					Back to Mentorships
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<MentorshipHeader
				mode="detail"
				title={`Mentorship: ${mentorship.intakeBatch.name}`}
				description="Manage mentees in this mentorship batch."
				onActionClick={handleAssignClick}
			/>

			<MenteeHeader
				mentorship={mentorship}
				maxMentees={MAX_MENTEES_PER_MENTORSHIP}
			/>

			<div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
				<div className="border-b border-border bg-muted/30 px-4 py-3">
					<h2 className="text-sm font-semibold text-foreground">
						Assigned Students
					</h2>
				</div>
				<div className="p-4">
					<MenteeTable mentees={mentorship.mentees} />
				</div>
			</div>
		</div>
	);
}
