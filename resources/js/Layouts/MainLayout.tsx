import { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip.js";
import { AppSidebar } from "@/components/appsidebar.js";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.js";
import { SiteHeader } from "@/components/sidebar/header.js";
import { NoteProvider } from "@/components/context/NoteEdit";

export default function MainLayout(children: ReactNode) {
  return (
    <TooltipProvider>
      <NoteProvider>
        <SidebarProvider defaultOpen>
          <AppSidebar />
          <SidebarInset className="h-dvh min-w-0 overflow-hidden md:h-[calc(100dvh-16px)]">
            <SiteHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </NoteProvider>
    </TooltipProvider>
  );
}
