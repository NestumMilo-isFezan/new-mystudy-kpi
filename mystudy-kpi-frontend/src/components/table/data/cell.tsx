import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DataCellProps = {
	value: ReactNode;
	className?: string;
	emptyText?: string;
};

export function DataCell({ value, className, emptyText = "-" }: DataCellProps) {
	const hasValue = value !== null && value !== undefined && value !== "";

	return (
		<span className={cn("text-sm text-foreground", className)}>
			{hasValue ? value : emptyText}
		</span>
	);
}
