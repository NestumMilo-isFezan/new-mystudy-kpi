import { Pencil, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { ConfirmationModalContent } from "@/components/modal/confirmation-modal";
import { AcademicEditGpaForm } from "@/components/pages/manage-academics/academic-edit-gpa-form";
import { useAcademicsMutations } from "@/components/pages/manage-academics/use-academics-mutations";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModal } from "@/hooks/use-modal";
import type { AcademicRecord } from "@/lib/api/academics-query";

type AcademicActionGroupProps = {
	record: AcademicRecord;
	variant: "card" | "cell";
};

export function AcademicActionGroup({
	record,
	variant,
}: AcademicActionGroupProps) {
	const modal = useModal();
	const { updateGpaMutation } = useAcademicsMutations();

	const handleEdit = useCallback(() => {
		modal.open({
			title: "Update GPA",
			description: `Update your result for ${record.termString}.`,
			Content: AcademicEditGpaForm,
			payload: record,
		});
	}, [modal, record]);

	const handleClear = useCallback(() => {
		modal.open({
			title: "Clear GPA",
			description: `Are you sure you want to clear the GPA for ${record.termString}?`,
			size: "sm",
			Content: ConfirmationModalContent,
			payload: {
				onConfirm: () => updateGpaMutation.mutate({ id: record.id, gpa: null }),
				confirmLabel: "Clear",
				variant: "destructive",
				isPending: updateGpaMutation.isPending,
			},
		});
	}, [modal, record, updateGpaMutation]);

	return (
		<ButtonGroup className={variant === "card" ? "w-full justify-end" : ""}>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleEdit}
				title="Edit GPA"
			>
				<Pencil className="size-4" />
			</Button>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={handleClear}
				className="text-destructive hover:bg-destructive/10 hover:text-destructive"
				title="Clear GPA"
			>
				<Trash2 className="size-4" />
			</Button>
		</ButtonGroup>
	);
}
