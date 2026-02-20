import { Check, ListFilter, Loader2, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAssignStudentContext } from "./provider";

export function StudentListPanel() {
	const {
		selectedBatchId,
		isLoadingStudents,
		filteredStudents,
		selectedStudentIds,
		searchQuery,
		onSearchChange,
		onSelectAll,
		onToggleStudent,
		onCreateStudent,
	} = useAssignStudentContext();

	return (
		<main className="flex-1 w-full min-w-0">
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<h2 className="text-xl font-bold flex items-center gap-3">
							<Users className="h-5 w-5 text-primary" />
							Available Students
						</h2>
						<p className="text-sm text-muted-foreground">
							{selectedBatchId === 0
								? "Please select a batch to see students."
								: "Select students without an assigned mentor."}
						</p>
					</div>

					{selectedBatchId > 0 && filteredStudents.length > 0 && (
						<Button
							variant="ghost"
							size="sm"
							className="text-primary hover:text-primary hover:bg-primary/5 h-8 font-semibold"
							onClick={onSelectAll}
						>
							{selectedStudentIds.size === filteredStudents.length
								? "Deselect All"
								: "Select All"}
						</Button>
					)}
				</div>

				{selectedBatchId === 0 ? (
					<div className="py-24 flex flex-col items-center justify-center text-center bg-muted/20 rounded-3xl border-2 border-dashed">
						<div className="h-16 w-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
							<ListFilter className="h-8 w-8 text-muted-foreground" />
						</div>
						<p className="font-medium text-muted-foreground">
							Select an intake batch to continue
						</p>
					</div>
				) : isLoadingStudents ? (
					<div className="py-24 flex flex-col items-center justify-center text-center bg-muted/20 rounded-3xl animate-pulse">
						<Loader2 className="h-10 w-10 animate-spin text-primary opacity-20 mb-4" />
						<p>Retrieving student list...</p>
					</div>
				) : filteredStudents.length === 0 ? (
					<div className="py-24 flex flex-col items-center justify-center text-center bg-muted/20 rounded-3xl">
						<div className="h-16 w-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
							<Users className="h-8 w-8 text-muted-foreground opacity-30" />
						</div>
						<p className="font-medium text-muted-foreground">
							No students available in this batch
						</p>
						<Button variant="link" onClick={onCreateStudent} className="mt-2">
							Register a new student instead?
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						<InputGroup className="bg-background shadow-sm">
							<InputGroupAddon className="pl-3">
								<Search className="h-4 w-4 text-muted-foreground" />
							</InputGroupAddon>
							<InputGroupInput
								placeholder="Search students by name, ID or email..."
								className="flex-1"
								value={searchQuery}
								onChange={(event) => onSearchChange(event.target.value)}
							/>
						</InputGroup>

						<div className="border rounded-2xl overflow-hidden">
							<ScrollArea className="h-[500px]">
								<div className="divide-y">
									{filteredStudents.map((student) => {
										const isSelected = selectedStudentIds.has(student.id);
										return (
											<button
												type="button"
												key={student.id}
												className={cn(
													"w-full flex items-start gap-4 p-4 text-left transition-all",
													isSelected
														? "bg-primary/5 shadow-inner"
														: "hover:bg-muted/30",
												)}
												onClick={() => onToggleStudent(student.id)}
											>
												<Checkbox
													checked={isSelected}
													onCheckedChange={() => onToggleStudent(student.id)}
													className="mt-1 h-5 w-5 rounded-md"
												/>
												<div className="flex-1 min-w-0">
													<div className="font-semibold truncate text-base flex items-center gap-2">
														{student.firstName} {student.lastName}
														{isSelected && (
															<Check className="h-4 w-4 text-primary" />
														)}
													</div>
													<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-sm text-muted-foreground">
														<span className="font-mono bg-muted/50 px-1.5 rounded border border-border/50 text-xs">
															{student.identifier}
														</span>
														<span className="truncate">{student.email}</span>
													</div>
												</div>
											</button>
										);
									})}
								</div>
							</ScrollArea>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
