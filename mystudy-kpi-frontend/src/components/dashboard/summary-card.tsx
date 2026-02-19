import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SummaryCardProps {
	title: React.ReactNode;
	value: string | number;
	description: string;
	icon: LucideIcon;
	trend?: {
		value: string | number;
		isPositive: boolean;
		label: string;
	};
	children?: React.ReactNode;
	className?: string;
}

export function SummaryCard({
	title,
	value,
	description,
	icon: Icon,
	trend,
	children,
	className,
}: SummaryCardProps) {
	return (
		<div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
			<div className="flex items-center justify-between space-y-0 pb-2">
				<div className="text-sm font-medium">{title}</div>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</div>
			<div className="flex flex-col gap-1">
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground">{description}</p>
				{trend && (
					<div
						className={cn(
							"mt-1 flex items-center gap-1 text-xs font-medium",
							trend.isPositive ? "text-emerald-600" : "text-destructive",
						)}
					>
						{trend.value} {trend.label}
					</div>
				)}
				{children}
			</div>
		</div>
	);
}
