import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { router, usePage } from "@inertiajs/react";
import {
	CloudCheck,
	CloudOff,
	Loader2,
	PinIcon,
	Share,
	Trash,
} from "lucide-react";
import { useNote } from "../context/NoteEdit";
import { Input } from "../ui/input";
import { route } from "ziggy-js";
import { Badge } from "@/components/ui/badge";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Tag, Check } from "lucide-react";
import { IPage } from "@/lib/types";
import { Label } from "@/types/model";
import { cn } from "@/lib/utils";

export function SiteHeader() {
	const { labels } = usePage<IPage>().props;
	const { url } = usePage(),
		{ data, processing, handleChange, setData } = useNote();

	let noteLabelIds = data.labels?.map((l: any) => String(l.id || l)) || [];

	const toggleLabelToNote = (labelId: number) => {
		const idStr = String(labelId);
		let newLabels;
		console.log(labelId);

		if (noteLabelIds.includes(idStr)) {
			newLabels = noteLabelIds.filter((id: string) => id !== idStr);
		} else {
			newLabels = [...noteLabelIds, idStr];
		}

		setData({
			...data,
			labels: newLabels,
		});
	};

	return (
		<header className="flex h-10 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-10"
				/>
				{url.startsWith("/notes/") && (
					<>
						<Input
							value={data.title}
							id="title"
							onChange={handleChange}
							placeholder="Tiêu đề..."
							className="text-base! font-medium w-fit border-none px-0 focus-visible:ring-0 placeholder:text-slate-300"
						/>
						<div className="ml-auto flex items-center gap-2">
							{processing ? (
								<div className="flex items-center text-blue-500">
									<Loader2 className="h-4 w-4 animate-spin mr-1" /> Đang lưu...
								</div>
							) : navigator.onLine ? (
								<div className="flex items-center text-green-600">
									<CloudCheck className="h-4 w-4 mr-1" /> Đã lưu lên mây
								</div>
							) : (
								<div className="flex items-center text-amber-600">
									<CloudOff className="h-4 w-4 mr-1" /> Đang lưu ngoại tuyến
								</div>
							)}
							<Button size="sm" className="hidden sm:flex">
								<Share />
							</Button>
							<Popover>
								<PopoverTrigger asChild>
									<Button size="sm" variant="outline" className="gap-2">
										<Tag className="h-4 w-4" />
										<span className="hidden md:inline">Nhãn</span>
										{noteLabelIds.length > 0 && (
											<Badge
												variant="secondary"
												className="ml-1 px-1 h-5 min-w-5 justify-center"
											>
												{noteLabelIds.length}
											</Badge>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-60 p-0" align="end">
									<Command>
										<CommandInput placeholder="Tìm nhãn..." />
										<CommandList>
											<CommandEmpty>Không tìm thấy nhãn.</CommandEmpty>
											<CommandGroup>
												{labels?.map((label: Label) => (
													<CommandItem
														key={label.id}
														onSelect={() => toggleLabelToNote(label.id)}
														className={cn("flex items-center justify-between")}
													>
														<div className="flex items-center gap-2">
															<div className="w-3 h-3 rounded-full" />
															<span>{label.name}</span>
														</div>
														{noteLabelIds.includes(String(label.id)) && (
															<Check className="h-4 w-4 text-primary" />
														)}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<Button
								size="sm"
								variant="secondary"
								onClick={() => router.patch(route("notes.togglePin", data.id))}
								className="hidden sm:flex"
							>
								<PinIcon />
							</Button>
							<Button
								size="sm"
								variant="secondary"
								onClick={() => router.patch(route("notes.togglePin", data.id))}
								className="hidden sm:flex"
							>
								<PinIcon />
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onClick={() => router.delete(route("notes.destroy", data.id))}
								className="hidden sm:flex"
							>
								<Trash />
							</Button>
						</div>
					</>
				)}
			</div>
		</header>
	);
}
