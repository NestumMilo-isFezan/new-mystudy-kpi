import { Button } from "@/components/ui/button";
import type { ModalContentProps } from "./modal-provider";

export type ConfirmModalPayload = {
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void | Promise<void>;
	variant?: "default" | "destructive";
};

export function ConfirmModal({
	payload,
	close,
}: ModalContentProps<ConfirmModalPayload>) {
	const handleConfirm = async () => {
		await payload.onConfirm();
		close();
	};

	return (
		<div className="flex flex-col gap-6 pt-2">
			<div className="flex justify-end gap-3">
				<Button type="button" variant="outline" onClick={close}>
					{payload.cancelText ?? "Cancel"}
				</Button>
				<Button
					type="button"
					variant={payload.variant ?? "default"}
					onClick={handleConfirm}
				>
					{payload.confirmText ?? "Confirm"}
				</Button>
			</div>
		</div>
	);
}
