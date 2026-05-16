import { ReactNode, useEffect, useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip.js";
import { AppSidebar } from "@/components/appsidebar.js";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.js";
import { SiteHeader } from "@/components/sidebar/header.js";
import { NoteProvider } from "@/components/context/NoteEdit";
import { router, usePage } from "@inertiajs/react";
import { Toaster } from "@/components/ui/sonner";
import { IPage } from "@/lib/types";
import { toast } from "sonner";
import { MailWarning } from "lucide-react";
import { route } from "ziggy-js";

interface UserPreferences {
	theme?: "light" | "dark";
	font_size?: "sm" | "base" | "lg" | "xl";
}

export default function MainLayout(children: ReactNode) {
	const { url, props } = usePage<IPage>();
	const [open, setOpen] = useState(true);

	const user = props.auth.user;
	const preferences = (props.auth.user?.preferences || {}) as UserPreferences;

	const [theme, setTheme] = useState(preferences?.theme || "light");
	const [fontSize, setFontSize] = useState(preferences?.font_size || "base");

	const fontSizeMap = { sm: "14px", base: "16px", lg: "18px", xl: "20px" };

	useEffect(() => {
		if (preferences?.theme) setTheme(preferences.theme);
		if (preferences?.font_size) setFontSize(preferences.font_size);
	}, [preferences?.theme, preferences?.font_size]);

	useEffect(() => {
		const root = document.documentElement;
		const body = document.body;

		if (theme === "dark") {
			root.classList.add("dark");
			body.classList.add("dark");
		} else {
			root.classList.remove("dark");
			body.classList.remove("dark");
		}

		root.style.fontSize = fontSizeMap[fontSize] || "16px";

		body.style.setProperty("--note-font-size", fontSizeMap[fontSize] || "16px");
	}, [theme, fontSize]);

	useEffect(() => {
		let toastId: string | number;

		if (user && !user.email_verified_at) {
			toastId = toast.error("Tài khoản chưa xác thực", {
				description: "Vui lòng xác nhận email để sử dụng đầy đủ tính năng.",
				duration: Infinity,
				icon: <MailWarning className="h-5 w-5 text-destructive" />,
				action: {
					label: "Gửi lại mã",
					onClick: () => {
						router.post(
							route("verification.send", {}, false),
							{},
							{
								onSuccess: () => toast.success("Đã gửi lại link xác nhận!"),
							},
						);
					},
				},
			});
		}

		return () => {
			if (toastId) toast.dismiss(toastId);
		};
	}, [user?.email_verified_at]);

	return (
		<TooltipProvider>
			<NoteProvider>
				<SidebarProvider
					open={window.location.pathname !== "/" && open}
					onOpenChange={setOpen}
				>
					<AppSidebar />
					<SidebarInset className="h-dvh min-w-0 overflow-hidden md:h-[calc(100dvh-(var(--spacing)*4))] flex flex-col">
						{url !== "/" && <SiteHeader />}
						<div className="block flex-1 overflow-auto">{children}</div>
						<Toaster closeButton richColors />
					</SidebarInset>
				</SidebarProvider>
			</NoteProvider>
		</TooltipProvider>
	);
}
