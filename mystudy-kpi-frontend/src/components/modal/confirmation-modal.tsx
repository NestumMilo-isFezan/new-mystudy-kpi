import type { ModalContentProps } from "@/components/modal/modal-provider";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

export type ConfirmationModalPayload = {
	onConfirm: () => void | Promise<void>;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "default" | "destructive";
	isPending?: boolean;
};

export function ConfirmationModalContent({
	payload,
	close,
}: ModalContentProps<ConfirmationModalPayload>) {
	const {
		onConfirm,
		confirmLabel = "Confirm",
		cancelLabel = "Cancel",
		variant = "default",
		isPending = false,
	} = payload;

	const handleConfirm = async () => {
		await onConfirm();
		close();
	};

	return (
		<DialogFooter>
			<Button variant="outline" onClick={close} disabled={isPending}>
				{cancelLabel}
			</Button>
			<Button variant={variant} onClick={handleConfirm} disabled={isPending}>
				{isPending ? "Processing..." : confirmLabel}
			</Button>
		</DialogFooter>
	);
}
