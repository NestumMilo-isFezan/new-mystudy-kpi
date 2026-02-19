import { LecturerActionMenu } from "@/components/pages/manage-lecturer/lecturer-action-menu";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Lecturer } from "@/lib/api/lecturers.functions";

type LecturerCardProps = {
	lecturer: Lecturer;
};

export function LecturerCard({ lecturer }: LecturerCardProps) {
	return (
		<Card size="sm" className="gap-3">
			<CardHeader className="pb-0">
				<CardTitle>{`${lecturer.firstName} ${lecturer.lastName}`}</CardTitle>
				<CardDescription>{lecturer.identifier}</CardDescription>
				<CardAction>
					<LecturerActionMenu lecturer={lecturer} variant="card" />
				</CardAction>
			</CardHeader>
			<CardContent className="pt-0 text-sm text-muted-foreground">
				<div className="flex flex-col gap-1">
					<span>{lecturer.email}</span>
				</div>
			</CardContent>
		</Card>
	);
}
