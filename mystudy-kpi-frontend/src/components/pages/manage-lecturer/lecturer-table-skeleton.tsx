import { Skeleton } from "@/components/ui/skeleton";

export function LecturerTableSkeleton() {
	return (
		<div className="grid gap-4">
			{/* Toolbar skeleton */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-1 items-center gap-2">
					<Skeleton className="h-9 w-64" />
					<Skeleton className="h-9 w-24" />
				</div>
				<Skeleton className="h-9 w-32" />
			</div>

			{/* Table skeleton (Desktop) */}
			<div className="hidden md:block">
				<div className="rounded-xl border border-border bg-card">
					<div className="border-b border-border p-4">
						<div className="grid grid-cols-5 gap-4">
							{Array.from({ length: 5 }).map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Static array for skeleton
								<Skeleton key={i} className="h-4 w-24" />
							))}
						</div>
					</div>
					<div className="divide-y divide-border">
						{Array.from({ length: 5 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Static array for skeleton
							<div key={i} className="p-4">
								<div className="grid grid-cols-5 gap-4">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-8 w-8 ml-auto rounded-full" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Mobile list skeleton */}
			<div className="space-y-3 md:hidden">
				{Array.from({ length: 3 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Static array for skeleton
					<div key={i} className="rounded-xl border border-border bg-card p-5">
						<div className="flex items-center justify-between gap-4">
							<div className="grid gap-2">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-4 w-24" />
							</div>
							<Skeleton className="h-8 w-8 rounded-full" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
