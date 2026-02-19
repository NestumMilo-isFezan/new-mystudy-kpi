import { getRouteApi, Link, useRouterState } from "@tanstack/react-router";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

const breadcrumbPageMap: Record<string, string> = {
	"/dashboard": "Dashboard",
	"/settings/profile": "Profile Settings",
	"/settings/user-sessions": "Browser Sessions",
	"/staff/intakes": "Manage Intakes",
	"/staff/manage-lecturers": "Manage Lecturers",
	"/staff/manage-students": "Manage Students",
	"/kpi/overview": "KPI Overview",
	"/kpi/academics": "Manage Academics",
	"/kpi/academics/analytics": "Academic Analytics",
	"/kpi/records": "KPI Achievements",
	"/kpi/records/analytics": "KPI Analytics",
	"/kpi/target": "Manage KPI Target",
	"/kpi/target/edit": "Edit KPI Target",
	"/kpi/challenges": "Manage Challenges",
	"/mentorship/manage-student": "Manage Mentees",
	"/mentorship/assign-student": "Assign Students",
};

function normalizePathname(pathname: string) {
	if (pathname.length > 1 && pathname.endsWith("/")) {
		return pathname.slice(0, -1);
	}

	return pathname;
}

const authRouteApi = getRouteApi("/_auth");

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const normalizedPathname = normalizePathname(pathname);
	const { session } = authRouteApi.useRouteContext();

	const currentPage = breadcrumbPageMap[normalizedPathname] ?? "Workspace";

	return (
		<SidebarProvider className="bg-muted/50">
			<AppSidebar session={session} variant="inset" collapsible="icon" />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink render={<Link to="/dashboard" />}>
										Workspace
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>{currentPage}</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>

				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="mx-auto w-full max-w-7xl">{children}</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
