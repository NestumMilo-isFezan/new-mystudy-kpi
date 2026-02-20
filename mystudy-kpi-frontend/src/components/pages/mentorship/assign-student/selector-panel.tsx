import { ListFilter, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BatchSelector } from "./batch-selector";
import { LecturerSelector } from "./lecturer-selector";
import { useAssignStudentContext } from "./provider";

export function SelectorPanel() {
	const { selectedCount, isAssignDisabled, isPending, onAssign } =
		useAssignStudentContext();

	return (
		<aside className="w-full lg:w-72 space-y-8 shrink-0">
			<div className="space-y-6">
				<div className="space-y-1">
					<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
						<ListFilter className="h-4 w-4" />
						Selection
					</h3>
				</div>

				<div className="space-y-4">
					<LecturerSelector />
					<BatchSelector />

					<div className="hidden lg:block pt-6 border-t border-border/50">
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm text-muted-foreground">
								Students Selected
							</span>
							<Badge variant={selectedCount > 0 ? "default" : "secondary"}>
								{selectedCount}
							</Badge>
						</div>
						<Button
							className="w-full shadow-lg"
							disabled={isAssignDisabled}
							onClick={onAssign}
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
							) : null}
							Confirm Assignment
						</Button>
					</div>
				</div>
			</div>
		</aside>
	);
}
