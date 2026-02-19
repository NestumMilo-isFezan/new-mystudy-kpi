import { MenteeActionGroup } from "@/components/pages/mentorship/manage-student/mentee-action-group";
import type { Student } from "@/lib/api/students.functions";

type MenteeCardProps = {
	student: Student;
};

export function MenteeCard({ student }: MenteeCardProps) {
	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<p className="font-medium text-foreground truncate">{`${student.firstName} ${student.lastName}`}</p>
					<p className="text-xs font-mono text-muted-foreground">
						{student.identifier}
					</p>
				</div>
				<MenteeActionGroup student={student} variant="card" />
			</div>
			<div className="text-sm text-muted-foreground truncate">
				{student.email}
			</div>
		</div>
	);
}
