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
import type { KpiRecord } from "@/lib/api/kpi-records-query";

const levelMap: Record<number, string> = {
	0: "Faculty",
	1: "University",
	2: "Local",
	3: "National",
	4: "International",
};

const categoryMap: Record<number, string> = {
	0: "Professional",
	1: "Technical",
};

type ActionGroupProps = {
	record: KpiRecord;
	variant: "card" | "cell";
};

type KpiRecordCardProps = {
	record: KpiRecord;
	ActionGroup: ComponentType<ActionGroupProps>;
};

export function KpiRecordCard({ record, ActionGroup }: KpiRecordCardProps) {
	const achievementLabel =
		record.type === "certification"
			? categoryMap[record.category ?? 0]
			: levelMap[record.level ?? 0];

	return (
		<Card size="sm" className="gap-3">
			<CardHeader className="pb-0">
				<CardTitle className="line-clamp-1">{record.title}</CardTitle>
				<CardDescription>{record.semester.termString}</CardDescription>
				<CardAction>
					<ActionGroup record={record} variant="card" />
				</CardAction>
			</CardHeader>
			<CardContent className="pt-0 flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<BadgeCell label={record.type.toUpperCase()} variant="outline" />
					<span className="text-sm font-medium text-muted-foreground">
						{achievementLabel}
					</span>
				</div>
				{record.description && (
					<p className="text-xs text-muted-foreground line-clamp-2 italic">
						"{record.description}"
					</p>
				)}
			</CardContent>
		</Card>
	);
}
