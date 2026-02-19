# Frontend Feature Development Guideline (Table Features)

This guide outlines the standard architecture for building new frontend features that involve data tables, following the pattern established in the `manage-intake` module.

## 1. Architecture Overview

To ensure a smooth user experience with no flickering and proper loading states, table features are split into three main parts:

1.  **Static Header:** Contains the page title, description, and primary actions (e.g., "Create" button). This component is rendered *outside* the Suspense boundary so it remains visible while data fetches or refreshes.
2.  **Table Skeleton:** A loading state that mimics the structure of both the desktop table and the mobile card list.
3.  **Data Table:** The actual table component that suspends while data is being fetched.

## 2. Directory Structure

New features should be located in `src/components/pages/[feature-name]/`.

```text
src/components/pages/[feature-name]/
├── [feature-name]-header.tsx         # Static header with actions
├── [feature-name]-table.tsx          # Data-dependent table component
├── [feature-name]-table-skeleton.tsx # Loading state
├── [feature-name]-table-columns.tsx  # Column definitions (ColumnDef[])
├── [feature-name]-table-control.ts   # Table configuration (TableControlConfig)
├── [feature-name]-action-menu.tsx    # Row action menu (Dropdown)
├── [feature-name]-create-form.tsx    # Creation form (for modals)
└── [feature-name]-card.tsx           # Mobile-optimized card view
```

## 3. Component Implementation

### 3.1 Static Header (`-header.tsx`)

This component should rely only on local state or context (like modals), not on async data.

```typescript
export function FeatureHeader() {
    const modal = useModal();
    // Handler for creating new items
    
    return (
        <Heading title="..." description="..." icon={...}>
            <Button onClick={handleCreate}>Create</Button>
        </Heading>
    );
}
```

### 3.2 Table Skeleton (`-table-skeleton.tsx`)

Provide a skeleton for both desktop and mobile views.

```typescript
export function FeatureTableSkeleton() {
    return (
        <div className="grid gap-4">
            {/* Toolbar Skeleton */}
            <div className="flex ...">...</div>
            
            {/* Desktop Table Skeleton */}
            <div className="hidden md:block">...</div>
            
            {/* Mobile Card Skeleton */}
            <div className="md:hidden">...</div>
        </div>
    );
}
```

### 3.3 Data Table (`-table.tsx`)

Wrap the UI in `TableControl`. This component should use `useSuspenseQuery`.

```typescript
export function FeatureTable() {
    const { data } = useSuspenseQuery(featureQueryOptions);
    const columns = useMemo(() => getFeatureTableColumns(), []);

    return (
        <TableControl data={data} columns={columns} config={featureConfig}>
            <div className="grid gap-4">
                <TableToolbar />
                <div className="hidden md:block">
                    <CoreTable />
                </div>
                <div className="md:hidden">
                    <FeatureMobileList />
                </div>
            </div>
        </TableControl>
    );
}
```

## 4. Route Integration (`src/routes/...`)

The route file is responsible for orchestrating the page layout, pre-fetching data, and handling loading states.

### 4.1 Data Pre-fetching
Use the `loader` or `beforeLoad` function to call `ensureQueryData`. This initiates the fetch as soon as the user starts navigating to the route, which helps in parallelizing data loading and rendering.

```typescript
export const Route = createFileRoute("/_auth/feature-page")({
	// Pre-fetch data to populate the query cache
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(featureQueryOptions);
	},
	component: FeaturePage,
});
```

### 4.2 Page Component Structure
The page component should provide a stable layout wrapper. The `FeatureHeader` is placed outside the `Suspense` boundary to ensure it's always visible, while the `FeatureTable` is wrapped in `Suspense` with the custom skeleton.

```typescript
function FeaturePage() {
	return (
		// Standardized layout wrapper: vertical flex with consistent spacing
		<div className="flex flex-col gap-8 py-6 text-foreground">
			{/* 1. Static Header: Remains visible during all data fetches */}
			<FeatureHeader />

			{/* 2. Async Body: Suspends while data is loading */}
			<Suspense fallback={<FeatureTableSkeleton />}>
				<FeatureTable />
			</Suspense>
		</div>
	);
}
```

## 5. Table Configuration (`-table-control.ts`)

Define a declarative configuration object using `TableControlConfig`.

```typescript
import type { TableControlConfig } from "@/components/table/core/table-config";

export const featureTableControlConfig: TableControlConfig = {
	query: {
		placeholder: "Search by name...",
		desktopColumns: ["name"],
		mobileColumns: ["name"],
	},
	filters: [
		{
			columnId: "status",
			label: "Status",
			placeholder: "Filter status",
			options: [
				{ label: "Active", value: "active" },
				{ label: "Inactive", value: "inactive" },
			],
		},
	],
	sortOptions: [
		{ columnId: "name", label: "Name" },
		{ columnId: "createdAt", label: "Date Created" },
	],
	columns: [
		{ columnId: "name", label: "Name", hideable: false },
		{ columnId: "status", label: "Status", hideable: true },
	],
};
```

## 5. Key Design Principles

1.  **Stable Layout:** The page title and primary actions must never flicker or disappear during data refreshing.
2.  **Headless State:** Always use `useTableContext()` to access table state (sorting, filtering) rather than local state where possible.
3.  **Responsive First:** Ensure every table has a corresponding `MobileList` or `Card` view.
4.  **Label Clarity:** Filters must show `Label: Value` (e.g., `Status: Active`) in the toolbar.
5.  **Integrated Headers:** Prefer `FilterCell` for columns that act as primary filters to allow filtering directly from the table header.
