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
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { usePage } from "@inertiajs/react";
import { IPage } from "@/lib/types";
import AuthenticationPopup from "./AuthenticationPopup";

export function AppSidebar() {
  const { auth } = usePage<IPage>().props,
    { user } = auth;

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <CardTitle>Efficia Note</CardTitle>
        <Input id="search" type="text" placeholder="Search note" />
        <Button>New</Button>
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
        {user ? (
          <NavUser user={{ name: "a", email: "aa", avatar: "" }} />
        ) : (
          <AuthenticationPopup />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
