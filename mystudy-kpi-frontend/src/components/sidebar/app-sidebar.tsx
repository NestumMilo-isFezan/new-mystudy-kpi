import { ChartBar, LayoutDashboard, UsersRound, Wrench } from "lucide-react";
import { useMemo } from "react";

import type { SessionResponse } from "@/lib/api/profile.functions";
import { type AppRole, mapRole } from "@/lib/auth/role-map";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "../ui/sidebar";
import { Header } from "./header";
import { NavMain, type NavMainItem } from "./nav-main";
import { NavUser } from "./nav-user";

type NavMainItemWithRoles = NavMainItem & {
	roles?: AppRole[];
};

const navMainItems: NavMainItemWithRoles[] = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Manage KPI",
		url: "/kpi/overview",
		icon: ChartBar,
		roles: ["student"],
		items: [
			{ title: "Overview", url: "/kpi/overview" },
			{ title: "Manage Academics", url: "/kpi/academics" },
			{ title: "Manage KPI Records", url: "/kpi/records" },
			{ title: "Manage KPI Target", url: "/kpi/target" },
			{ title: "Manage Challenges", url: "/kpi/challenges" },
		],
	},
	{
		title: "Mentorships",
		url: "/mentorship",
		icon: UsersRound,
		roles: ["lecturer", "staff"],
	},
	{
		title: "Staff Utilities",
		url: "/staff/intakes",
		icon: Wrench,
		roles: ["staff"],
		items: [
			{ title: "Manage Intakes", url: "/staff/intakes" },
			{ title: "Manage Lecturers", url: "/staff/manage-lecturers" },
			{ title: "Manage Students", url: "/staff/manage-students" },
		],
	},
];

export function AppSidebar({
	session,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	session: SessionResponse;
}) {
	const userRole = useMemo(
		() => mapRole(session.user.role),
		[session.user.role],
	);

	const filteredNavMainItems = useMemo(() => {
		return navMainItems.filter((item) => {
			if (!item.roles) {
				return true;
			}
			return item.roles.includes(userRole);
		});
	}, [userRole]);

	const profileName = useMemo(() => {
		const firstName = session.profile?.firstName ?? session.user.firstName;
		const lastName = session.profile?.lastName ?? session.user.lastName;
		return [firstName, lastName].filter(Boolean).join(" ");
	}, [
		session.profile?.firstName,
		session.profile?.lastName,
		session.user.firstName,
		session.user.lastName,
	]);
	const displayName = profileName || session.user.identifier;

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<Header />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={filteredNavMainItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						name: displayName,
						email: session.user.email,
					}}
				/>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
