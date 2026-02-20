import { StudentActionGroup } from "@/components/pages/manage-student/student-action-group";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Student } from "@/lib/api/students.functions";

type StudentCardProps = {
	student: Student;
};

export function StudentCard({ student }: StudentCardProps) {
	return (
		<Card size="sm" className="gap-3">
			<CardHeader className="pb-0">
				<CardTitle>{`${student.firstName} ${student.lastName}`}</CardTitle>
				<CardDescription>{student.identifier}</CardDescription>
				<CardAction>
					<StudentActionGroup student={student} variant="card" />
				</CardAction>
			</CardHeader>
			<CardContent className="pt-0 text-sm text-muted-foreground">
				<div className="flex flex-col gap-1">
					<span>{student.email}</span>
				</div>
			</CardContent>
		</Card>
	);
}
