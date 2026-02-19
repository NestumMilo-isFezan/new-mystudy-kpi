import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeaderCellProps = {
	children: ReactNode;
	className?: string;
};

export function HeaderCell({ children, className }: HeaderCellProps) {
	return (
		<div className={cn("flex items-center gap-2 font-medium", className)}>
			{children}
		</div>
	);
}
