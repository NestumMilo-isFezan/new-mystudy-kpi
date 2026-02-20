import type { ComponentType } from "react";
import { BadgeCell } from "@/components/table/data/badge-cell";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { AcademicRecord } from "@/lib/api/academics-query";

type ActionGroupProps = {
	record: AcademicRecord;
	variant: "card" | "cell";
};

type AcademicCardProps = {
	record: AcademicRecord;
	ActionGroup: ComponentType<ActionGroupProps>;
};

export function AcademicCard({ record, ActionGroup }: AcademicCardProps) {
	return (
		<Card size="sm" className="gap-3">
			<CardHeader className="pb-0">
				<CardTitle>{record.termString}</CardTitle>
				<CardDescription>{record.academicYearString}</CardDescription>
				<CardAction>
					<ActionGroup record={record} variant="card" />
				</CardAction>
			</CardHeader>
			<CardContent className="pt-0 flex justify-between items-center">
				<div className="flex gap-2">
					{record.isShortSemester && (
						<BadgeCell label="Short" variant="secondary" />
					)}
				</div>
				<span className="text-lg font-mono font-bold">
					GPA: {record.gpa ?? "Not Taken"}
				</span>
			</CardContent>
		</Card>
	);
}
