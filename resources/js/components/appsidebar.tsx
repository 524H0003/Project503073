import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./sidebar/user";
import { CardTitle } from "./ui/card";
import { Input } from "./ui/input";

import { Link, usePage } from "@inertiajs/react";
import { IPage } from "@/lib/types";
import CreateNote from "./CreateNoteButton";
import { Note } from "@/types/model";
import { route } from "ziggy-js";

export function AppSidebar() {
	const { auth, notes } = usePage<IPage>().props,
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
						{notes.map((note: Note) => (
							<SidebarMenuItem key={note.id}>
								<SidebarMenuButton
									asChild
									isActive={url === `/notes/${note.id}/edit`}
								>
									<Link
										href={route("notes.edit", note.id)}
										className="flex flex-col items-start gap-1 py-2 h-auto"
									>
										<span className="font-medium line-clamp-1 w-full text-sm">
											{note.title || "Ghi chú không tiêu đề"}
										</span>
										<span className="text-xs text-muted-foreground line-clamp-1">
											{note.content || "Chưa có nội dung"}
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
		</Sidebar>
	);
}
