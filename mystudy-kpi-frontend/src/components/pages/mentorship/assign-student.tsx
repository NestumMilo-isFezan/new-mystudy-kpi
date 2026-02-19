"use client";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Check, ListFilter, Loader2, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { IntakeBatchSelector } from "@/components/pages/mentorship/manage-student/intake-batch-selector";
import { MentorshipHeader } from "@/components/pages/mentorship/mentorship-header";
import { MentorshipStudentCreateForm } from "@/components/pages/mentorship/mentorship-student-create-form";
import { useMentorshipMutations } from "@/components/pages/mentorship/use-mentorship-mutations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModal } from "@/hooks/use-modal";
import { availableStudentsQueryOptions } from "@/lib/api/mentorships-query";
import { cn } from "@/lib/utils";

type AssignStudentProps = {
	lockedBatchId?: number;
	returnMentorshipId?: number;
};

export function AssignStudent({
	lockedBatchId,
	returnMentorshipId,
}: AssignStudentProps) {
	const navigate = useNavigate();
	const modal = useModal();
	const { assignMutation } = useMentorshipMutations();

	const [selectedBatchId, setSelectedBatchId] = useState<number>(
		lockedBatchId ?? 0,
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(
		new Set(),
	);

	const { data: availableStudents = [], isLoading: isLoadingStudents } =
		useQuery(availableStudentsQueryOptions(selectedBatchId));

	useEffect(() => {
		if (lockedBatchId) {
			setSelectedBatchId(lockedBatchId);
			setSelectedStudentIds(new Set());
		}
	}, [lockedBatchId]);

	const filteredStudents = useMemo(() => {
		if (!searchQuery) return availableStudents;
		const query = searchQuery.toLowerCase();
		return availableStudents.filter(
			(s) =>
				s.identifier.toLowerCase().includes(query) ||
				(s.firstName ?? "").toLowerCase().includes(query) ||
				(s.lastName ?? "").toLowerCase().includes(query) ||
				s.email.toLowerCase().includes(query),
		);
	}, [availableStudents, searchQuery]);

	const handleToggleStudent = (id: string) => {
		const next = new Set(selectedStudentIds);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		setSelectedStudentIds(next);
	};

	const handleSelectAll = () => {
		if (
			selectedStudentIds.size === filteredStudents.length &&
			filteredStudents.length > 0
		) {
			setSelectedStudentIds(new Set());
		} else {
			setSelectedStudentIds(new Set(filteredStudents.map((s) => s.id)));
		}
	};

	const handleCreateStudent = () => {
		modal.open({
			title: "Register New Student",
			description:
				"Create a student account and assign them to a batch. They will then appear in the selection list.",
			Content: MentorshipStudentCreateForm,
			payload: {
				defaultBatchId: selectedBatchId > 0 ? selectedBatchId : undefined,
			},
		});
	};

	const handleAssign = () => {
		if (selectedBatchId === 0 || selectedStudentIds.size === 0) return;
		assignMutation.mutate(
			{
				batchId: selectedBatchId,
				studentIds: Array.from(selectedStudentIds),
			},
			{
				onSuccess: () => {
					if (returnMentorshipId) {
						navigate({
							to: "/mentorship/$mentorshipId",
							params: { mentorshipId: String(returnMentorshipId) },
						});
						return;
					}

					navigate({ to: "/mentorship" });
				},
			},
		);
	};

	return (
		<div className="flex flex-col gap-10 max-w-7xl mx-auto px-1 lg:px-4 pb-24 lg:pb-12">
			<MentorshipHeader mode="assign" onActionClick={handleCreateStudent} />

			<div className="flex flex-col lg:flex-row gap-12 items-start">
				<aside className="w-full lg:w-72 space-y-8 shrink-0">
					<div className="space-y-6">
						<div className="space-y-1">
							<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
								<ListFilter className="h-4 w-4" />
								Selection
							</h3>
						</div>

						<div className="space-y-4">
							<div className="space-y-2">
								<Label className="text-sm font-medium">Intake Batch</Label>
								<IntakeBatchSelector
									value={selectedBatchId}
									source="active"
									disabled={Boolean(lockedBatchId)}
									onChange={(val) => {
										setSelectedBatchId(val);
										setSelectedStudentIds(new Set());
									}}
								/>
								{lockedBatchId && (
									<p className="text-xs text-amber-600 font-medium">
										Batch is locked for this mentorship.
									</p>
								)}
							</div>

							<div className="hidden lg:block pt-6 border-t border-border/50">
								<div className="flex items-center justify-between mb-4">
									<span className="text-sm text-muted-foreground">
										Students Selected
									</span>
									<Badge
										variant={
											selectedStudentIds.size > 0 ? "default" : "secondary"
										}
									>
										{selectedStudentIds.size}
									</Badge>
								</div>
								<Button
									className="w-full shadow-lg"
									disabled={
										selectedStudentIds.size === 0 || assignMutation.isPending
									}
									onClick={handleAssign}
								>
									{assignMutation.isPending ? (
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
									) : null}
									Confirm Assignment
								</Button>
							</div>
						</div>
					</div>
				</aside>

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
									onClick={handleSelectAll}
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
								<Button
									variant="link"
									onClick={handleCreateStudent}
									className="mt-2"
								>
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
										onChange={(e) => setSearchQuery(e.target.value)}
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
														onClick={() => handleToggleStudent(student.id)}
													>
														<Checkbox
															checked={isSelected}
															onCheckedChange={() =>
																handleToggleStudent(student.id)
															}
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
																<span className="truncate">
																	{student.email}
																</span>
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
			</div>

			{selectedStudentIds.size > 0 && (
				<div className="fixed bottom-0 inset-x-0 z-50 lg:hidden px-4 pb-8 pt-10 pointer-events-none bg-gradient-to-t from-background via-background/80 to-transparent">
					<div className="pointer-events-auto max-w-sm mx-auto animate-in slide-in-from-bottom-full duration-500 ease-in-out">
						<Button
							size="lg"
							className="w-full h-14 rounded-2xl shadow-2xl shadow-primary/30 font-bold text-lg gap-2 flex items-center justify-center"
							onClick={handleAssign}
							disabled={assignMutation.isPending}
						>
							{assignMutation.isPending ? (
								<Loader2 className="h-5 w-5 animate-spin" />
							) : (
								<>
									Assign {selectedStudentIds.size} Student
									{selectedStudentIds.size === 1 ? "" : "s"}
								</>
							)}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
