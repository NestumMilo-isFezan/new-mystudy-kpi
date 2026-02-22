export function getStickyClass(sticky?: "left" | "right") {
	if (sticky === "left") {
		return "sticky left-0 z-20 bg-background shadow-[8px_0_8px_-8px_hsl(var(--border))]";
	}

	if (sticky === "right") {
		return "sticky right-0 z-20 bg-background shadow-[-8px_0_8px_-8px_hsl(var(--border))]";
	}

	return "";
}

export function getAlignClass(align?: "start" | "center" | "end") {
	if (align === "center") {
		return "text-center";
	}

	if (align === "end") {
		return "text-right";
	}

	return "text-left";
}
