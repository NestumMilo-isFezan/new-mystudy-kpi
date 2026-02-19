import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const settingsNavItems = [
	{
		title: "Profile",
		href: "/settings/profile",
		icon: User,
	},
	{
		title: "Browser Sessions",
		href: "/settings/user-sessions",
		icon: ShieldCheck,
	},
];

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const activeItem =
		settingsNavItems.find((item) => pathname === item.href) ||
		settingsNavItems[0];

	return (
		<div className="flex flex-col gap-8 py-6">
			{/* Mobile Nav */}
			<div className="md:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="w-full justify-between">
							<span className="flex items-center gap-2">
								<activeItem.icon className="size-4" />
								{activeItem.title}
							</span>
							<ChevronDown className="size-4 opacity-50" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
						{settingsNavItems.map((item) => (
							<DropdownMenuItem key={item.href} asChild>
								<Link
									to={item.href}
									className={cn(
										"w-full cursor-pointer",
										pathname === item.href && "bg-accent",
									)}
								>
									<item.icon className="mr-2 size-4" />
									{item.title}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="grid grid-cols-1 gap-10 md:grid-cols-5">
				{/* Desktop Sidebar Nav */}
				<aside className="hidden md:block md:col-span-1">
					<nav className="flex flex-col gap-1">
						{settingsNavItems.map((item) => (
							<Link
								key={item.href}
								to={item.href}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
									pathname === item.href
										? "bg-accent text-accent-foreground"
										: "text-muted-foreground",
								)}
							>
								<item.icon className="size-4" />
								{item.title}
							</Link>
						))}
					</nav>
				</aside>

				{/* Main Content */}
				<main className="md:col-span-4">{children}</main>
			</div>
		</div>
	);
}
