import { Pencil, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { KpiRecordForm } from "@/components/pages/manage-kpi-records/kpi-record-form";
import { useKpiRecordMutations } from "@/components/pages/manage-kpi-records/use-kpi-record-mutations";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModal } from "@/hooks/use-modal";
import type { KpiRecord } from "@/lib/api/kpi-records-query";

type KpiRecordActionGroupProps = {
	record: KpiRecord;
	variant: "card" | "cell";
};

export function KpiRecordActionGroup({
	record,
	variant,
}: KpiRecordActionGroupProps) {
	const modal = useModal();
	const { deleteMutation } = useKpiRecordMutations();

	const handleEdit = useCallback(() => {
		modal.open({
			title: "Edit KPI Record",
			description: "Update the details of your KPI achievement.",
			Content: KpiRecordForm,
			payload: record,
		});
	}, [modal, record]);

	const handleDelete = useCallback(() => {
		modal.open({
			title: "Delete Record",
			description: `Are you sure you want to delete "${record.title}"? This action cannot be undone.`,
			size: "sm",
			Content: ConfirmationModalContent,
			payload: {
				onConfirm: () => deleteMutation.mutate(record.id),
				confirmLabel: "Delete",
				variant: "destructive",
				isPending: deleteMutation.isPending,
			},
		});
	}, [modal, record, deleteMutation]);

	return (
		<ButtonGroup className={variant === "card" ? "w-full justify-end" : ""}>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleEdit}
				title="Edit Record"
			>
				<Pencil className="size-4" />
			</Button>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleDelete}
				className="text-destructive hover:bg-destructive/10 hover:text-destructive"
				title="Delete Record"
			>
				<Trash2 className="size-4" />
			</Button>
		</ButtonGroup>
	);
}
