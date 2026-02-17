import { ChartBar, LayoutDashboard, UsersRound, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { SessionResponse } from "@/lib/api/profile-api";
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
		roles: ["student", "lecturer", "staff"],
		items: [
			{ title: "Overview", url: "/kpi/overview" },
			{ title: "CGPA", url: "/kpi/cgpa" },
			{ title: "Curricular", url: "/kpi/curricular" },
			{ title: "Certificates", url: "/kpi/certificates" },
			{ title: "Challenges", url: "/kpi/challenges" },
		],
	},
	{
		title: "Mentorships",
		url: "/mentorships/dashboard",
		icon: UsersRound,
		roles: ["lecturer", "staff"],
		items: [
			{ title: "Dashboard", url: "/mentorships/dashboard" },
			{ title: "Manage Students", url: "/mentorships/students" },
		],
	},
	{
		title: "Staff Utilities",
		url: "/staff/intakes",
		icon: Wrench,
		roles: ["staff"],
		items: [
			{ title: "Manage Intakes", url: "/staff/intakes" },
			{ title: "Register Lecturer", url: "/staff/register-lecturer" },
			{ title: "Register Student", url: "/staff/register-student" },
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

	const profileName = useMemo(
		() =>
			[session.profile?.firstName, session.profile?.lastName]
				.filter(Boolean)
				.join(" "),
		[session.profile?.firstName, session.profile?.lastName],
	);
	const [stableDisplayName, setStableDisplayName] = useState(
		session.user.identifier,
	);

	useEffect(() => {
		setStableDisplayName(session.user.identifier);
	}, [session.user.identifier]);

	useEffect(() => {
		if (profileName) {
			setStableDisplayName(profileName);
		}
	}, [profileName]);

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
						name: stableDisplayName,
						email: session.user.email,
					}}
				/>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
