import {
	type UseSuspenseQueryOptions,
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { KpiTargetForm } from "@/components/pages/manage-kpi-target/kpi-target-form";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Heading } from "@/components/ui/heading";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { adminStandardKpiTargetQueryOptions } from "@/lib/api/admin-mentorship-query";
import { intakeBatchesQueryOptions } from "@/lib/api/intake-batches-query";
import type {
	KpiAimResponse,
	SaveKpiAimPayload,
} from "@/lib/api/kpi-aim.functions";
import type { SerializedKpiAim } from "@/lib/api/mentorships.functions";
import { updateStandardKpiTargetFn } from "@/lib/api/mentorships.functions";

export const Route = createFileRoute("/_auth/_staff/staff/intake/assign-kpi")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(intakeBatchesQueryOptions),
	component: ManageStandardKpiAimsPage,
});

function ManageStandardKpiAimsPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: batches } = useSuspenseQuery(intakeBatchesQueryOptions);
	const [selectedBatchId, setSelectedBatchId] = useState<string>(
		batches[0]?.id.toString() || "",
	);

	const batchId = Number.parseInt(selectedBatchId, 10);
	const batchQueryOptions = adminStandardKpiTargetQueryOptions(batchId);
	const selectedBatch = batches.find(
		(batch) => batch.id.toString() === selectedBatchId,
	);

	const updateMutation = useMutation({
		mutationFn: (payload: SaveKpiAimPayload) =>
			updateStandardKpiTargetFn({
				data: { batchId, payload },
			}),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["admin-standard-kpi-target", batchId],
			});
			toast.success("Standard KPI target updated successfully.");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update standard KPI target.");
		},
	});

	// Adapt the batch-only target to the KpiTargetForm's expected KpiAimResponse structure
	const adaptedQueryOptions = useMemo(() => {
		return {
			...batchQueryOptions,
			select: (data: SerializedKpiAim | null): KpiAimResponse => ({
				personal: null,
				lecturer: null,
				batch: data
					? {
							sourceType: "faculty",
							cgpa: data.cgpa,
							activities: data.activities,
							competitions: data.competitions,
							certificates: data.certificates,
							source: "Current Standard",
						}
					: null,
				actual: {
					cgpa: null,
					activities: {
						faculty: 0,
						university: 0,
						local: 0,
						national: 0,
						international: 0,
					},
					competitions: {
						faculty: 0,
						university: 0,
						local: 0,
						national: 0,
						international: 0,
					},
					certificates: { professional: 0, technical: 0 },
				},
			}),
		} as unknown as UseSuspenseQueryOptions<
			KpiAimResponse,
			Error,
			KpiAimResponse,
			readonly unknown[]
		>;
	}, [batchQueryOptions]);

	return (
		<div className="flex flex-col gap-8 py-6 text-foreground">
			<Heading
				title="Standard KPI Targets"
				description="Set the standard KPI aims for each intake batch (Faculty targets)."
				icon={Target}
			>
				<Button
					type="button"
					variant="outline"
					onClick={() =>
						navigate({ to: "/staff/intake", search: { page: 1, limit: 25 } })
					}
					className="w-full md:w-auto"
				>
					<ChevronLeft className="mr-2 size-4" />
					Back to Intakes
				</Button>
			</Heading>

			<div className="space-y-6">
				<Field>
					<FieldLabel>Select Intake Batch</FieldLabel>
					<FieldContent>
						<Select
							value={selectedBatchId}
							onValueChange={(value) => setSelectedBatchId(value ?? "")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a batch">
									{selectedBatch?.name}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{batches.map((batch) => (
									<SelectItem key={batch.id} value={batch.id.toString()}>
										{batch.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FieldContent>
				</Field>

				{selectedBatchId && (
					<KpiTargetForm
						key={selectedBatchId}
						queryOptions={adaptedQueryOptions}
						onSubmit={(data) => updateMutation.mutate(data)}
						isPending={updateMutation.isPending}
						submitLabel="Update Faculty Target"
					/>
				)}
			</div>
		</div>
	);
}
