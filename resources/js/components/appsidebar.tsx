import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
} from "@/components/ui/sidebar";
import { NavUser } from "./sidebar/user";
import { CardTitle } from "./ui/card";
import { Input } from "./ui/input";

import { usePage } from "@inertiajs/react";
import { IPage } from "@/lib/types";
import AuthenticationPopup from "./AuthenticationPopup";
import CreateNote from "./CreateNoteButton";

export function AppSidebar() {
	const { auth } = usePage<IPage>().props,
		{ user } = auth,
		{ url } = usePage();

	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<CardTitle>Efficia Note</CardTitle>
				<Input id="search" type="text" placeholder="Search note" />

				{url !== "/" && <CreateNote />}
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{/* {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))} */}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				{user ? <NavUser user={user} /> : <AuthenticationPopup />}
			</SidebarFooter>
		</Sidebar>
	);
}
