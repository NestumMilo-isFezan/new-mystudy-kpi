import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

function normalizePathname(pathname: string) {
	if (pathname.length > 1 && pathname.endsWith("/")) {
		return pathname.slice(0, -1);
	}

	return pathname;
}

export type NavMainItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
};

export function NavMain({ items }: { items: NavMainItem[] }) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const normalizedPathname = normalizePathname(pathname);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Navigation</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const hasChildren = Boolean(item.items?.length);
					const isItemActive =
						normalizedPathname === normalizePathname(item.url) ||
						item.items?.some(
							(subItem) =>
								normalizedPathname === normalizePathname(subItem.url),
						);

					if (!hasChildren) {
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									isActive={normalizedPathname === normalizePathname(item.url)}
									render={
										<Link to={item.url}>
											{item.icon ? (
												<item.icon className="transition-[color,transform] duration-200 ease-linear" />
											) : null}
											<span>{item.title}</span>
										</Link>
									}
								/>
							</SidebarMenuItem>
						);
					}

					return (
						<Collapsible
							key={item.title}
							defaultOpen={isItemActive}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger
									render={
										<SidebarMenuButton tooltip={item.title}>
											{item.icon ? (
												<item.icon className="transition-[color,transform] duration-200 ease-linear" />
											) : null}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-100 ease-linear group-data-open/collapsible:rotate-90" />
										</SidebarMenuButton>
									}
								/>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton
													isActive={
														normalizedPathname ===
														normalizePathname(subItem.url)
													}
													render={
														<Link to={subItem.url}>
															<span>{subItem.title}</span>
														</Link>
													}
												/>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
