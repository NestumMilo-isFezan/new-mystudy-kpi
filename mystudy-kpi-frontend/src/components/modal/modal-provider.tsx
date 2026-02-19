import type { ComponentType, ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export type ModalContentProps<TPayload> = {
	payload: TPayload;
	close: () => void;
};

export type ModalConfig<TPayload> = {
	title?: string;
	description?: string;
	size?: ModalSize;
	showCloseButton?: boolean;
	contentClassName?: string;
	Content: ComponentType<ModalContentProps<TPayload>>;
	payload: TPayload;
};

type ActiveModal = {
	title?: string;
	description?: string;
	size: ModalSize;
	showCloseButton: boolean;
	contentClassName?: string;
	Content: ComponentType<ModalContentProps<unknown>>;
	payload: unknown;
};

type ModalContextValue = {
	isOpen: boolean;
	activeModal: ActiveModal | null;
	open: <TPayload>(config: ModalConfig<TPayload>) => void;
	replace: <TPayload>(config: ModalConfig<TPayload>) => void;
	close: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

const sizeClassMap: Record<ModalSize, string> = {
	sm: "sm:max-w-sm",
	md: "sm:max-w-md",
	lg: "sm:max-w-lg",
	xl: "sm:max-w-xl",
};

function toActiveModal<TPayload>(config: ModalConfig<TPayload>): ActiveModal {
	return {
		title: config.title,
		description: config.description,
		size: config.size ?? "md",
		showCloseButton: config.showCloseButton ?? false,
		contentClassName: config.contentClassName,
		Content: config.Content as ComponentType<ModalContentProps<unknown>>,
		payload: config.payload,
	};
}

export function ModalProvider({ children }: { children: ReactNode }) {
	const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);

	const close = useCallback(() => {
		setActiveModal(null);
	}, []);

	const open = useCallback(<TPayload,>(config: ModalConfig<TPayload>) => {
		setActiveModal(toActiveModal(config));
	}, []);

	const replace = useCallback(<TPayload,>(config: ModalConfig<TPayload>) => {
		setActiveModal(toActiveModal(config));
	}, []);

	const contextValue = useMemo<ModalContextValue>(
		() => ({
			isOpen: activeModal !== null,
			activeModal,
			open,
			replace,
			close,
		}),
		[activeModal, close, open, replace],
	);

	const Content = activeModal?.Content;

	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<ModalContext.Provider value={contextValue}>
			{children}
			{isMounted && (
				<Dialog
					open={activeModal !== null}
					onOpenChange={(nextOpen) => !nextOpen && close()}
				>
					<DialogContent
						showCloseButton={activeModal?.showCloseButton ?? true}
						className={`${activeModal ? sizeClassMap[activeModal.size] : ""} ${activeModal?.contentClassName ?? ""}`}
					>
						{activeModal && (activeModal.title || activeModal.description) ? (
							<DialogHeader>
								{activeModal.title ? (
									<DialogTitle>{activeModal.title}</DialogTitle>
								) : null}
								{activeModal.description ? (
									<DialogDescription>
										{activeModal.description}
									</DialogDescription>
								) : null}
							</DialogHeader>
						) : null}
						{Content && activeModal ? (
							<Content payload={activeModal.payload} close={close} />
						) : null}
					</DialogContent>
				</Dialog>
			)}
		</ModalContext.Provider>
	);
}

export function useModalContext() {
	const context = useContext(ModalContext);

	if (!context) {
		throw new Error("useModal must be used within ModalProvider");
	}

	return context;
}
