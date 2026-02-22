import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "lucide-react";
import { useTableContext } from "@/components/table/core/table-control";
import { Button } from "@/components/ui/button";

export function TablePagination() {
	const { serverPagination } = useTableContext();

	if (!serverPagination) {
		return null;
	}

	const { meta, page, onPageChange } = serverPagination;
	const { total, totalPages, limit } = meta;

	const canPrevious = page > 1;
	const canNext = page < totalPages;

	const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
	const rangeEnd = Math.min(page * limit, total);

	return (
		<div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
			<p className="text-muted-foreground text-sm">
				{total === 0
					? "No records"
					: `${rangeStart}–${rangeEnd} of ${total} records`}
			</p>

			<div className="flex items-center gap-1">
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(1)}
					disabled={!canPrevious}
					aria-label="First page"
				>
					<ChevronsLeftIcon className="size-4" />
				</Button>

				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(page - 1)}
					disabled={!canPrevious}
					aria-label="Previous page"
				>
					<ChevronLeftIcon className="size-4" />
				</Button>

				<span className="min-w-[80px] text-center text-sm">
					Page {page} of {totalPages === 0 ? 1 : totalPages}
				</span>

				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(page + 1)}
					disabled={!canNext}
					aria-label="Next page"
				>
					<ChevronRightIcon className="size-4" />
				</Button>

				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(totalPages)}
					disabled={!canNext}
					aria-label="Last page"
				>
					<ChevronsRightIcon className="size-4" />
				</Button>
			</div>
		</div>
	);
}
