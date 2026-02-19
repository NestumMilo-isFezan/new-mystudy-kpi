import type { ChartConfig } from "@/components/ui/chart";

export const kpiAnalyticsChartConfig = {
	activity: {
		label: "Activities",
		color: "#10b981",
	},
	competition: {
		label: "Competitions",
		color: "#f59e0b",
	},
	certification: {
		label: "Certifications",
		color: "#06b6d4",
	},
} satisfies ChartConfig;
