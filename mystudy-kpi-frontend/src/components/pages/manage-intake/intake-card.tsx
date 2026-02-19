import { IntakeActionMenu } from "@/components/pages/manage-intake/intake-action-menu";
import { BadgeCell } from "@/components/table/data/badge-cell";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { IntakeBatch } from "@/lib/api/intake-batches.functions";

type IntakeCardProps = {
	intake: IntakeBatch;
};

export function IntakeCard({ intake }: IntakeCardProps) {
	return (
		<Card size="sm" className="gap-3">
			<CardHeader className="pb-0">
				<CardTitle>{intake.name}</CardTitle>
				<CardDescription>Start year {intake.startYear}</CardDescription>
				<CardAction>
					<IntakeActionMenu intake={intake} variant="card" />
				</CardAction>
			</CardHeader>
			<CardContent className="pt-0">
				<BadgeCell
					label={intake.isActive ? "Active" : "Inactive"}
					variant={intake.isActive ? "default" : "outline"}
				/>
			</CardContent>
		</Card>
	);
}
