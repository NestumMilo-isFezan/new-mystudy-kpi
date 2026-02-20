import {
	type UseSuspenseQueryOptions,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { type ComponentType, useMemo } from "react";
import { AcademicActionGroup } from "@/components/pages/manage-academics/academic-action-group";
import { AcademicCard } from "@/components/pages/manage-academics/academic-card";
import { getAcademicTableColumns } from "@/components/pages/manage-academics/academics-table-columns";
import { academicsTableControlConfig } from "@/components/pages/manage-academics/academics-table-control";
import { CoreTable } from "@/components/table/core/table";
import {
	TableControl,
	useTableContext,
} from "@/components/table/core/table-control";
import { TableToolbar } from "@/components/table/core/table-toolbar";
import {
	type AcademicRecord,
	academicsQueryOptions,
} from "@/lib/api/academics-query";

type ActionGroupProps = {
	record: AcademicRecord;
	variant: "card" | "cell";
};

type AcademicsTableProps = {
	ActionGroup?: ComponentType<ActionGroupProps>;
	queryOptions?: unknown;
};

export function AcademicsTable({
	ActionGroup = AcademicActionGroup,
	queryOptions: customQueryOptions = academicsQueryOptions,
}: AcademicsTableProps) {
	const { data: academics } = useSuspenseQuery(
		customQueryOptions as UseSuspenseQueryOptions<AcademicRecord[]>,
	);

	const columns = useMemo(
		() => getAcademicTableColumns(ActionGroup),
		[ActionGroup],
	);

	return (
		<TableControl
			data={academics}
			columns={columns}
			config={academicsTableControlConfig}
		>
			<div className="grid gap-4">
				<TableToolbar />

				<div className="hidden md:block">
					<CoreTable emptyMessage="No academic records match your filters." />
				</div>

				<AcademicMobileList ActionGroup={ActionGroup} />
			</div>
		</TableControl>
	);
}

function AcademicMobileList({
	ActionGroup,
}: {
	ActionGroup: ComponentType<ActionGroupProps>;
}) {
	const { table } = useTableContext<AcademicRecord>();
	const currentRows = table.getRowModel().rows;

	return (
		<div className="space-y-3 md:hidden">
			{currentRows.length > 0 ? (
				currentRows.map((row: Row<AcademicRecord>) => (
					<AcademicCard
						key={row.id}
						record={row.original}
						ActionGroup={ActionGroup}
					/>
				))
			) : (
				<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
					No academic records match your filters.
				</div>
			)}
		</div>
	);
}
