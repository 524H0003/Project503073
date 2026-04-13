import { ChevronsUpDown, LogOut, User as UserIcon } from "lucide-react";

import { Link } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { route } from "ziggy-js";
import { User } from "@/types/model";

export function NavUser({
	user,
	className,
	alwaysTop = false,
}: {
	user: User;
	className?: string;
	alwaysTop?: boolean;
}) {
	const { isMobile } = useSidebar(),
		AvatarHolder = () => (
			<Avatar className="h-8 w-8 rounded-lg">
				{/* <AvatarImage src={user.avatar || ""} alt={user.name} /> */}
				<AvatarFallback className="rounded-lg">
					<UserIcon></UserIcon>
				</AvatarFallback>
			</Avatar>
		);

	return (
		<SidebarMenu className={className}>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<AvatarHolder />
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={alwaysTop ? "top" : isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						{/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
						<DropdownMenuItem asChild>
							<Link
								href={route("logout")}
								method="post"
								as="button"
								className="w-full"
							>
								<LogOut />
								Logout
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
