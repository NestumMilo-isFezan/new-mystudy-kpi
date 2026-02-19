import { Badge } from "@/components/ui/badge";

type BadgeCellProps = {
	label: string;
	variant?:
		| "default"
		| "secondary"
		| "destructive"
		| "outline"
		| "ghost"
		| "link";
};

export function BadgeCell({ label, variant = "outline" }: BadgeCellProps) {
	return <Badge variant={variant}>{label}</Badge>;
}
