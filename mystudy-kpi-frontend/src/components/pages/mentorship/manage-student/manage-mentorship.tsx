import {
	type UseSuspenseQueryOptions,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { Link, type LinkProps, useNavigate } from "@tanstack/react-router";
import { MenteeHeader } from "@/components/pages/mentorship/manage-student/mentee-header";
import { MenteeTable } from "@/components/pages/mentorship/manage-student/mentee-table";
import { MentorshipDetailContext } from "@/components/pages/mentorship/manage-student/mentorship-detail-context";
import { MentorshipHeader } from "@/components/pages/mentorship/mentorship-header";
import { useMentorshipMutations } from "@/components/pages/mentorship/use-mentorship-mutations";
import { buttonVariants } from "@/components/ui/button";
import type { Mentorship } from "@/lib/api/mentorships.functions";
import {
	adminMentorshipByIdQueryOptions,
	mentorshipByIdQueryOptions,
} from "@/lib/api/mentorships-query";

type ManageMentorshipProps = {
	mentorshipId: number;
	rootPath?: LinkProps["to"];
	studentRootPath?: string;
	isAdmin?: boolean;
};

const MAX_MENTEES_PER_MENTORSHIP = 5;

export function ManageMentorship({
	mentorshipId,
	rootPath = "/mentorship",
	studentRootPath = "/mentorship/students",
	isAdmin = false,
}: ManageMentorshipProps) {
	const queryOptions = (
		isAdmin
			? adminMentorshipByIdQueryOptions(mentorshipId)
			: mentorshipByIdQueryOptions(mentorshipId)
	) as UseSuspenseQueryOptions<
		Mentorship,
		Error,
		Mentorship,
		readonly unknown[]
	>;

	const { data: mentorship } = useSuspenseQuery(queryOptions);
	const navigate = useNavigate();
	const { removeMenteeMutation, removeMenteeAdminMutation } =
		useMentorshipMutations();

	const handleAssignClick = () => {
		if (!mentorship) return;
		navigate({
			to: `${rootPath as string}/assign` as LinkProps["to"],
			search: {
				batchId: mentorship.intakeBatch.id,
				mentorshipId: mentorship.id,
			} as never,
		});
	};

	const activeRemoveMutation = isAdmin
		? removeMenteeAdminMutation
		: removeMenteeMutation;

	const handleRemoveMentee = async (studentId: string) => {
		await activeRemoveMutation.mutateAsync(studentId);

		if (mentorship.mentees.length <= 1) {
			navigate({ to: rootPath, replace: true });
		}
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
				<Link to={rootPath} className={buttonVariants({ variant: "default" })}>
					Back to Mentorships
				</Link>
			</div>
		);
	}

	return (
		<MentorshipDetailContext.Provider
			value={{
				menteeCount: mentorship.menteeCount,
				isRemoving: activeRemoveMutation.isPending,
				onRemoveMentee: handleRemoveMentee,
			}}
		>
			<div className="space-y-6">
				<MentorshipHeader
					mode="detail"
					title={`Mentorship: ${mentorship.intakeBatch.name}`}
					description="Manage mentees in this mentorship batch."
					onActionClick={handleAssignClick}
					rootPath={rootPath}
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
						<MenteeTable
							mentees={mentorship.mentees}
							rootPath={studentRootPath}
						/>
					</div>
				</div>
			</div>
		</MentorshipDetailContext.Provider>
	);
}
