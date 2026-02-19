import { useNavigate } from "@tanstack/react-router";
import {
	ChevronsUpDown,
	LogOut,
	ShieldCheck,
	UserRoundCog,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useLogoutAndRedirect } from "@/lib/auth/use-logout-and-redirect";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar?: string;
	};
}) {
	const navigate = useNavigate();
	const { logoutAndRedirect, isPending: isLogoutPending } =
		useLogoutAndRedirect();

	const initials = user.name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");

	const handleProfileSettings = async () => {
		await navigate({ to: "/settings/profile" });
	};

	const handleSecuritySettings = async () => {
		await navigate({ to: "/settings/user-sessions" });
	};

	const handleLogout = async () => {
		await logoutAndRedirect();
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger className="group ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground h-12 gap-2 rounded-md p-2 text-left text-sm focus-visible:ring-2 flex w-full items-center overflow-hidden outline-hidden">
						<Avatar className="h-8 w-8 rounded-md after:rounded-md">
							<AvatarImage
								className="rounded-md"
								src={user.avatar}
								alt={user.name}
							/>
							<AvatarFallback className="rounded-md">
								{initials || "MK"}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{user.name}</span>
							<span className="truncate text-xs">{user.email}</span>
						</div>
						<ChevronsUpDown className="ml-auto size-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side="top"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-md after:rounded-md">
										<AvatarImage
											className="rounded-md"
											src={user.avatar}
											alt={user.name}
										/>
										<AvatarFallback className="rounded-md">
											{initials || "MK"}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{user.name}</span>
										<span className="truncate text-xs">{user.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleProfileSettings}>
							<UserRoundCog />
							Profile Settings
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleSecuritySettings}>
							<ShieldCheck />
							Security Settings
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleLogout} disabled={isLogoutPending}>
							<LogOut />
							{isLogoutPending ? "Logging out..." : "Log out"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
