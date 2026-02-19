import { flexRender } from "@tanstack/react-table";
import { useTableContext } from "@/components/table/core/table-control";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type CoreTableProps = {
	emptyMessage?: string;
	className?: string;
};

function getStickyClass(sticky?: "left" | "right") {
	if (sticky === "left") {
		return "sticky left-0 z-20 bg-background shadow-[8px_0_8px_-8px_hsl(var(--border))]";
	}

	if (sticky === "right") {
		return "sticky right-0 z-20 bg-background shadow-[-8px_0_8px_-8px_hsl(var(--border))]";
	}

	return "";
}

function getAlignClass(align?: "start" | "center" | "end") {
	if (align === "center") {
		return "text-center";
	}

	if (align === "end") {
		return "text-right";
	}

	return "text-left";
}

export function CoreTable({
	emptyMessage = "No records found.",
	className,
}: CoreTableProps) {
	const { table } = useTableContext();
	const visibleColumnLength = table.getVisibleFlatColumns().length;

	return (
		<div
			className={cn(
				"overflow-hidden rounded-xl border border-border bg-card",
				className,
			)}
		>
			<Table className="border-collapse border-hidden">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const stickyClass = getStickyClass(
									header.column.columnDef.meta?.sticky,
								);
								const alignClass = getAlignClass(
									header.column.columnDef.meta?.align,
								);

								return (
									<TableHead
										key={header.id}
										className={cn(stickyClass, alignClass, "bg-card")}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length > 0 ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => {
									const stickyClass = getStickyClass(
										cell.column.columnDef.meta?.sticky,
									);
									const alignClass = getAlignClass(
										cell.column.columnDef.meta?.align,
									);

									return (
										<TableCell
											key={cell.id}
											className={cn(stickyClass, alignClass, "bg-card")}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={Math.max(visibleColumnLength, 1)}
								className="h-16 text-center text-muted-foreground"
							>
								{emptyMessage}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
