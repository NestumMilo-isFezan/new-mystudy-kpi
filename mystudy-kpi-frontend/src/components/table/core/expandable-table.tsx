import { flexRender, type Row } from "@tanstack/react-table";
import React from "react";
import { useTableContext } from "@/components/table/core/table-control";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type CoreExpandableTableProps<TData> = {
	emptyMessage?: string;
	className?: string;
	renderSubComponent: (props: { row: Row<TData> }) => React.ReactNode;
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

export function CoreExpandableTable<TData>({
	emptyMessage = "No records found.",
	className,
	renderSubComponent,
}: CoreExpandableTableProps<TData>) {
	const { table } = useTableContext<TData>();
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
							<React.Fragment key={row.id}>
								<TableRow
									className={cn(
										"cursor-pointer transition-colors hover:bg-muted/20",
										row.getIsExpanded() && "bg-muted/5",
									)}
									onClick={() => row.toggleExpanded()}
								>
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
								{row.getIsExpanded() && (
									<TableRow className="bg-muted/5 border-b-0 hover:bg-muted/5">
										<TableCell colSpan={visibleColumnLength} className="p-0">
											{renderSubComponent({ row })}
										</TableCell>
									</TableRow>
								)}
							</React.Fragment>
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
				{table
					.getFooterGroups()
					.some((footerGroup) =>
						footerGroup.headers.some(
							(header) => header.column.columnDef.footer,
						),
					) && (
					<TableFooter>
						{table.getFooterGroups().map((footerGroup) => (
							<TableRow key={footerGroup.id}>
								{footerGroup.headers.map((header) => {
									const stickyClass = getStickyClass(
										header.column.columnDef.meta?.sticky,
									);
									const alignClass = getAlignClass(
										header.column.columnDef.meta?.align,
									);

									return (
										<TableCell
											key={header.id}
											className={cn(stickyClass, alignClass, "bg-muted/30")}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.footer,
														header.getContext(),
													)}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableFooter>
				)}
			</Table>
		</div>
	);
}
