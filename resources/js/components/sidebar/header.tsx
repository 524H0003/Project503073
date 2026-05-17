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
	Tag,
	Check,
	Lock,
	UserMinus,
	UserPlus,
} from "lucide-react";
import { useNote } from "../context/NoteEdit";
import { Input } from "../ui/input";
import { route } from "ziggy-js";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { IPage } from "@/lib/types";
import { Label } from "@/types/model";
import { cn } from "@/lib/utils";
import NoteLock from "./buttons/NoteLock";
import { useState } from "react";

export function SiteHeader() {
	const { labels } = usePage<IPage>().props;
	const { url, props } = usePage();
	const { data, processing, handleChange, setData } = useNote();

	const [shareEmail, setShareEmail] = useState("");
	const [sharePermission, setSharePermission] = useState("view");

	const errors = props.errors as any;

	let noteLabelIds = data.labels?.map((l: any) => String(l.id || l)) || [];

	const isCurrentlyLocked = data.is_locked && !data.is_opened;
	const isOwner = data.current_user_permission === "owner";
	const canEdit = isOwner || data.current_user_permission === "edit";

	const toggleLabelToNote = (labelId: number) => {
		if (isCurrentlyLocked || !canEdit) return;

		const idStr = String(labelId);
		let newLabels;

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

	const handleDeleteNote = () => {
		if (isCurrentlyLocked || !isOwner) return;
		router.delete(route("notes.destroy", data.id));
	};

	// Hàm xử lý gửi yêu cầu chia sẻ quyền lên Server
	const handleShareSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isCurrentlyLocked || !isOwner) return;

		router.post(
			route("notes.share", data.id),
			{
				email: shareEmail,
				permission: sharePermission,
			},
			{
				onSuccess: () => setShareEmail(""),
			},
		);
	};

	const handleUpdateOrRemoveShare = (
		targetUserId: number,
		action: "view" | "edit" | "remove",
	) => {
		if (isCurrentlyLocked || !isOwner) return;

		if (action === "remove") {
			router.delete(
				route("notes.share.remove", { note: data.id, user: targetUserId }),
			);
		} else {
			router.post(route("notes.share", data.id), {
				user_id: targetUserId,
				permission: action,
			});
		}
	};

	return (
		<header className="sticky top-0 z-30 flex min-h-10 shrink-0 items-center gap-2 overflow-hidden border-b border-white/20 bg-[linear-gradient(120deg,rgba(99,102,241,0.16),rgba(168,85,247,0.14),rgba(236,72,153,0.12))] backdrop-blur-3xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-10">
			{/* Background Glow */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl" />
				<div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-pink-400/20 blur-3xl" />
				<div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-purple-400/20 blur-3xl" />
			</div>

			<div className="relative flex w-full flex-wrap items-center gap-2 px-3 lg:px-6">
				<div className="flex items-center gap-2">
					<SidebarTrigger
						className={cn(
							"p-2 rounded-2xl border border-white/40 bg-white/50 text-indigo-600",
							"shadow-[0_8px_30px_rgb(99,102,241,0.15)] backdrop-blur-2xl",
							"transition-all duration-300",
							"hover:scale-105 hover:rotate-2 hover:bg-white/70 hover:text-purple-600",
							"relative z-50 cursor-pointer",
						)}
					/>

					<Separator
						orientation="vertical"
						className="mx-2 opacity-50 data-[orientation=vertical]:h-10"
					/>
				</div>

				{url.startsWith("/notes/") && (
					<>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								{isCurrentlyLocked && (
									<Lock className="h-4 w-4 text-amber-500 shrink-0" />
								)}
								<Input
									value={data.title}
									id="title"
									disabled={isCurrentlyLocked || !canEdit}
									onChange={handleChange}
									placeholder={
										canEdit ? "Tiêu đề..." : "Ghi chú chỉ đọc (Chặn sửa)..."
									}
									className={cn(
										"min-w-30 flex-1 border-none bg-transparent px-0 text-base font-bold tracking-tight shadow-none placeholder:text-slate-300 focus-visible:ring-0",
										(isCurrentlyLocked || !canEdit) &&
											"text-slate-400 cursor-not-allowed select-none",
									)}
								/>
							</div>

							{canEdit && (
								<div className="mt-1 hidden sm:flex items-center gap-2 text-xs text-slate-500">
									{processing ? (
										<Loader2 className="mr-1 h-4 w-4 animate-spin text-blue-600" />
									) : navigator.onLine ? (
										<CloudCheck className="mr-1 h-4 w-4 text-emerald-600" />
									) : (
										<CloudOff className="mr-1 h-4 w-4 text-amber-600" />
									)}
									<span className="font-medium tracking-wide">
										{processing
											? "Đang lưu"
											: navigator.onLine
												? "Đã lưu lên mây"
												: "Đang lưu ngoại tuyến"}
									</span>
								</div>
							)}
						</div>

						<div className="ml-auto flex flex-wrap items-center gap-2">
							<Dialog>
								<DialogTrigger asChild disabled={isCurrentlyLocked || !isOwner}>
									<Button
										variant="outline"
										size="sm"
										className={cn(
											"group border-white/40 bg-white/40 shadow-[0_8px_24px_rgba(99,102,241,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-linear-to-r hover:from-indigo-50 hover:to-pink-50 hover:text-indigo-600 hover:shadow-[0_12px_30px_rgba(99,102,241,0.18)]",
											(isCurrentlyLocked || !isOwner) &&
												"opacity-50 cursor-not-allowed hover:translate-y-0",
										)}
									>
										<Share className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 sm:mr-2" />
										<span className="hidden sm:inline">Chia sẻ</span>
									</Button>
								</DialogTrigger>

								<DialogContent className="rounded-2xl border border-white/40 bg-white/80 backdrop-blur-3xl shadow-2xl max-w-[90vw] sm:max-w-[480px]">
									<DialogHeader>
										<DialogTitle className="text-slate-800 font-bold flex items-center gap-2">
											<Share className="h-5 w-5 text-indigo-500" /> Chia sẻ ghi
											chú
										</DialogTitle>
										<DialogDescription className="text-xs text-slate-500">
											Cấp quyền cho thành viên khác truy cập đọc hoặc chỉnh sửa
											nội dung.
										</DialogDescription>
									</DialogHeader>

									{/* Form thêm email chia sẻ mới */}
									<form
										onSubmit={handleShareSubmit}
										className="mt-2 flex items-center gap-2"
									>
										<div className="flex-1">
											<Input
												type="email"
												placeholder="Nhập email người nhận..."
												value={shareEmail}
												onChange={(e) => setShareEmail(e.target.value)}
												required
												className="rounded-xl border-slate-200 bg-white/50 text-sm focus-visible:ring-indigo-400"
											/>
										</div>
										<Select
											value={sharePermission}
											onValueChange={setSharePermission}
										>
											<SelectTrigger className="w-25 rounded-xl border-slate-200 bg-white/50 text-sm">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="rounded-xl">
												<SelectItem value="view">Đọc</SelectItem>
												<SelectItem value="edit">Viết</SelectItem>
											</SelectContent>
										</Select>
										<Button
											type="submit"
											size="sm"
											className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
										>
											<UserPlus className="h-4 w-4" />
										</Button>
									</form>
									{errors?.email && (
										<p className="text-xs font-medium text-red-500 px-1">
											{errors.email}
										</p>
									)}
									{errors?.message && (
										<p className="text-xs font-medium text-red-500 px-1">
											{errors.message}
										</p>
									)}

									{/* Danh sách những người đang có quyền truy cập */}
									<div className="mt-4 border-t border-slate-100 pt-3">
										<h4 className="text-xs font-semibold text-slate-600 mb-2 tracking-wide">
											Người có quyền truy cập:
										</h4>
										<div className="max-h-[160px] overflow-y-auto flex flex-col gap-2 pr-1">
											{data.shared_users && data.shared_users.length > 0 ? (
												data.shared_users.map((user: any) => (
													<div
														key={user.id}
														className="flex items-center justify-between bg-white/40 p-2 rounded-xl border border-white/20"
													>
														<div className="flex flex-col min-w-0 flex-1 pr-2">
															<span className="text-xs font-semibold text-slate-700 truncate">
																{user.name}
															</span>
															<span className="text-[10px] text-slate-400 truncate">
																{user.email}
															</span>
														</div>
														<div className="flex items-center gap-2">
															<Select
																value={user.pivot?.permission || "view"}
																onValueChange={(val: "view" | "edit") =>
																	handleUpdateOrRemoveShare(user.id, val)
																}
															>
																<SelectTrigger className="h-7 w-[80px] rounded-lg text-[11px] border-none bg-slate-100 text-slate-600">
																	<SelectValue />
																</SelectTrigger>
																<SelectContent className="rounded-lg">
																	<SelectItem value="view">Đọc</SelectItem>
																	<SelectItem value="edit">Viết</SelectItem>
																</SelectContent>
															</Select>
															<Button
																size="icon"
																variant="ghost"
																className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg shrink-0"
																onClick={() =>
																	handleUpdateOrRemoveShare(user.id, "remove")
																}
															>
																<UserMinus className="h-3.5 w-3.5" />
															</Button>
														</div>
													</div>
												))
											) : (
												<p className="text-[11px] text-slate-400 text-center py-2">
													Ghi chú này chưa được chia sẻ cho ai.
												</p>
											)}
										</div>
									</div>
								</DialogContent>
							</Dialog>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="border-white/40 bg-white/40 shadow-[0_8px_24px_rgba(99,102,241,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:shadow-[0_12px_30px_rgba(99,102,241,0.18)]"
									>
										Menu
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									align="end"
									className="w-56 rounded-2xl border border-white/40 bg-white/60 p-1 shadow-2xl backdrop-blur-3xl"
								>
									<div className="flex flex-col gap-1">
										<Popover>
											<PopoverTrigger
												asChild
												disabled={isCurrentlyLocked || !canEdit}
											>
												<Button
													variant="outline"
													className={cn(
														"justify-start gap-2 border-none bg-transparent transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600",
														(isCurrentlyLocked || !canEdit) &&
															"opacity-50 cursor-not-allowed",
													)}
												>
													<Tag className="h-4 w-4" />
													Nhãn
												</Button>
											</PopoverTrigger>

											<PopoverContent
												className="w-60 rounded-2xl border border-white/40 bg-white/70 p-0 shadow-2xl backdrop-blur-3xl"
												align="end"
											>
												<Command>
													<CommandInput placeholder="Tìm nhãn..." />
													<CommandList>
														<CommandEmpty>Không tìm thấy nhãn nào</CommandEmpty>
														<CommandGroup>
															{labels?.map((label: Label) => (
																<CommandItem
																	key={label.id}
																	onSelect={() => toggleLabelToNote(label.id)}
																	className="flex items-center justify-between"
																>
																	<span>{label.name}</span>
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
											variant="outline"
											disabled={isCurrentlyLocked || !canEdit}
											className={cn(
												"justify-start gap-2 border-none bg-transparent transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600",
												(isCurrentlyLocked || !canEdit) &&
													"opacity-50 cursor-not-allowed",
											)}
											onClick={() =>
												router.patch(route("notes.togglePin", data.id))
											}
										>
											<PinIcon className="h-4 w-4" />
											Ghim ghi chú
										</Button>

										<NoteLock isOwner={isOwner} />

										{isOwner && (
											<AlertDialog>
												<AlertDialogTrigger
													asChild
													disabled={isCurrentlyLocked}
												>
													<Button
														variant="destructive"
														className={cn(
															"justify-start gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-red-300/30",
															isCurrentlyLocked &&
																"opacity-40 cursor-not-allowed hover:scale-100 shadow-none",
														)}
													>
														<Trash className="h-4 w-4" />
														Xóa ghi chú
													</Button>
												</AlertDialogTrigger>

												<AlertDialogContent className="rounded-2xl border border-white/40 bg-white/80 backdrop-blur-2xl shadow-2xl max-w-[90vw] sm:max-w-[420px]">
													<AlertDialogHeader>
														<AlertDialogTitle className="text-slate-800 font-bold">
															Bạn có chắc chắn muốn xóa?
														</AlertDialogTitle>
														<AlertDialogDescription className="text-slate-500 text-sm">
															Hành động này không thể hoàn tác. Ghi chú này sẽ
															bị xóa vĩnh viễn khỏi tài khoản của bạn.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter className="mt-2 gap-2">
														<AlertDialogCancel className="rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
															Hủy
														</AlertDialogCancel>
														<AlertDialogAction
															onClick={handleDeleteNote}
															className="rounded-xl bg-red-600 text-white shadow-md hover:bg-red-700"
														>
															Xác nhận xóa
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										)}
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</>
				)}
			</div>
		</header>
	);
}
