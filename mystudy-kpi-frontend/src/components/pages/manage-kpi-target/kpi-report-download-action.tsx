import { Download } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button, type ButtonProps } from "@/components/ui/button";
import { KpiTargetReport } from "./kpi-target-report";

type KpiReportDownloadActionProps = {
	queryOptions?: unknown;
	size?: ButtonProps["size"];
};

export function KpiReportDownloadAction({
	queryOptions,
	size = "default",
}: KpiReportDownloadActionProps) {
	const contentRef = useRef<HTMLDivElement>(null);
	const handlePrint = useReactToPrint({
		contentRef,
		documentTitle: `KPI_Target_Report_${new Date().toLocaleDateString()}`,
	});

	return (
		<>
			<Button
				type="button"
				variant="outline"
				onClick={() => handlePrint()}
				size={size}
				className="w-full md:w-auto"
			>
				<Download className="mr-2 size-4" />
				Download Report
			</Button>

			{/* Hidden container for printing with specialized print layout */}
			<div className="hidden">
				<div ref={contentRef} className="bg-white p-6 text-slate-900">
					<div className="mx-auto max-w-4xl">
						<div className="mb-8 border-b border-slate-200 pb-6">
							<h1 className="text-3xl font-bold tracking-tight">
								KPI Target Report
							</h1>
							<p className="mt-2 text-slate-500">
								Performance comparison and target achievement analysis.
							</p>
							<div className="mt-4 flex gap-4 text-xs font-medium uppercase tracking-wider text-slate-400">
								<span>Generated: {new Date().toLocaleDateString()}</span>
								<span>•</span>
								<span>Source: MyStudy KPI System</span>
							</div>
						</div>
						<KpiTargetReport queryOptions={queryOptions} />
					</div>
				</div>
			</div>
		</>
	);
}
