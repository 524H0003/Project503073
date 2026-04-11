import { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip.js";
import { AppSidebar } from "@/components/appsidebar.js";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.js";
import { SiteHeader } from "@/components/sidebar/header.js";

export default function MainLayout(children: ReactNode) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
