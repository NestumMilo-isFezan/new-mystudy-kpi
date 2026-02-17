import { Link } from "@tanstack/react-router";
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
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Navigation</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const hasChildren = Boolean(item.items?.length);

					if (!hasChildren) {
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
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
							defaultOpen={item.isActive}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger
									render={
										<SidebarMenuButton>
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
