import { CalendarDays, UserPlus, Users } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import type { Mentorship } from "@/lib/api/mentorships.functions";

type MenteeHeaderProps = {
	mentorship: Mentorship;
	maxMentees: number;
};

export function MenteeHeader({ mentorship, maxMentees }: MenteeHeaderProps) {
	const remainingSlots = Math.max(0, maxMentees - mentorship.menteeCount);

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<SummaryCard
				title="Start Year"
				value={mentorship.intakeBatch.startYear}
				description="Academic year of this batch."
				icon={CalendarDays}
			/>
			<SummaryCard
				title="Assigned"
				value={`${mentorship.menteeCount} / ${maxMentees}`}
				description="Current mentees assigned."
				icon={Users}
			/>
			<SummaryCard
				title="Remaining Slots"
				value={remainingSlots}
				description="Available slots for new mentees."
				icon={UserPlus}
			/>
		</div>
	);
}
