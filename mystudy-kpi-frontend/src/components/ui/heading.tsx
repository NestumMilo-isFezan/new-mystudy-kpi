import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface HeadingProps {
	title: string;
	description?: string;
	icon?: LucideIcon;
	children?: ReactNode;
}

export function Heading({
	title,
	description,
	icon: Icon,
	children,
}: HeadingProps) {
	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div className="flex items-center gap-4">
				{Icon && (
					<div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card">
						<Icon className="size-6 text-primary" />
					</div>
				)}
				<div className="grid gap-1">
					<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
					{description && (
						<p className="text-sm text-muted-foreground">{description}</p>
					)}
				</div>
			</div>
			{children && <div className="flex items-center gap-2">{children}</div>}
		</div>
	);
}
