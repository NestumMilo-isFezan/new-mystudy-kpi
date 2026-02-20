import type { ComponentType } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Challenge } from "@/lib/api/challenges.functions";

type ActionGroupProps = {
	record: Challenge;
	variant: "card" | "cell";
};

type ChallengeCardProps = {
	challenge: Challenge;
	ActionGroup: ComponentType<ActionGroupProps>;
};

export function ChallengeCard({ challenge, ActionGroup }: ChallengeCardProps) {
	return (
		<Card size="sm" className="gap-3">
			<CardHeader className="pb-0">
				<CardTitle className="line-clamp-1">
					{challenge.semester.termString}
				</CardTitle>
				<CardDescription>Hurdle Reflection</CardDescription>
				<CardAction>
					<ActionGroup record={challenge} variant="card" />
				</CardAction>
			</CardHeader>
			<CardContent className="pt-0 flex flex-col gap-3">
				<div>
					<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
						Challenge
					</span>
					<p className="text-sm line-clamp-2">{challenge.challenge}</p>
				</div>
				<div>
					<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
						Plan
					</span>
					<p className="text-sm line-clamp-2 italic">{challenge.plan}</p>
				</div>
			</CardContent>
		</Card>
	);
}
