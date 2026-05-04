import { ReactNode, useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip.js";
import { AppSidebar } from "@/components/appsidebar.js";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.js";
import { SiteHeader } from "@/components/sidebar/header.js";
import { NoteProvider } from "@/components/context/NoteEdit";
import { usePage } from "@inertiajs/react";

export default function MainLayout(children: ReactNode) {
	const { url } = usePage(),
		[open, setOpen] = useState(true);

	return (
		<TooltipProvider>
			<NoteProvider>
				<SidebarProvider open={url !== "/" && open} onOpenChange={setOpen}>
					<AppSidebar />
					<SidebarInset className="h-dvh min-w-0 overflow-hidden md:h-[calc(100dvh-16px)] flex flex-col">
						{url !== "/" && <SiteHeader />}
						<div className="block flex-1 overflow-auto">{children}</div>
					</SidebarInset>
				</SidebarProvider>
			</NoteProvider>
		</TooltipProvider>
	);
}
