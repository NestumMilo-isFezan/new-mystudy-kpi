import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { KpiTargetForm } from "@/components/pages/manage-kpi-target/kpi-target-form";
import type { SaveKpiAimPayload } from "@/lib/api/kpi-aim.functions";
import { mentorshipStudentKpiTargetQueryOptions } from "@/lib/api/mentorship-students-query";
import { updateMenteeKpiTargetFn } from "@/lib/api/mentorships.functions";

export const Route = createFileRoute(
	"/_auth/_lecturer/mentorship/students/$id/kpi-target/assign",
)({
	component: StudentKpiTargetAssignPage,
});

function StudentKpiTargetAssignPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const queryOptions = mentorshipStudentKpiTargetQueryOptions(id);

	const updateMutation = useMutation({
		mutationFn: (payload: SaveKpiAimPayload) =>
			updateMenteeKpiTargetFn({ data: { studentId: id, payload } }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["mentorship-students", id],
			});
			toast.success("Student KPI target updated successfully.");
			navigate({
				to: "/mentorship/students/$id/kpi-target",
				params: { id },
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update student KPI target.");
		},
	});

	return (
		<KpiTargetForm
			queryOptions={queryOptions}
			onSubmit={(data) => updateMutation.mutate(data)}
			isPending={updateMutation.isPending}
			submitLabel="Update Student Target"
		/>
	);
}
