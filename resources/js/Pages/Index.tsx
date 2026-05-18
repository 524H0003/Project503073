import Layout from "@/Layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookText, LayoutGrid, List } from "lucide-react"; // Thêm LayoutGrid và List
import CreateNote from "@/components/CreateNoteButton";
import { router, usePage } from "@inertiajs/react";
import { IPage } from "@/lib/types";
import AuthenticationCard from "@/components/AuthenticationCard";
import { NavUser } from "@/components/sidebar/user";
import { route } from "ziggy-js";
import { SearchBar } from "@/components/custom/SearchBar";
import { useState } from "react"; // Thêm useState

const noteColors = [
	"bg-red-50",
	"bg-blue-50",
	"bg-green-50",
	"bg-yellow-50",
	"bg-purple-50",
	"bg-pink-50",
];

export default function Dashboard() {
	const { auth, notes } = usePage<IPage>().props,
		{ user } = auth;

	// Khởi tạo state: 'grid' hoặc 'list'
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	return Layout(
		user ? (
			<div className="flex h-full flex-col">
				{/* Header */}
				<div className="sticky top-0 z-20 border-b border-white/50  px-4 py-4 shadow-sm backdrop-blur-xl sm:px-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-400 to-cyan-300 shadow-md transition-transform duration-200 hover:scale-105">
								<BookText className="h-6 w-6 text-white" />
							</div>

							<div>
								<div className="flex items-center gap-2 flex-wrap">
									<CardTitle className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
										Efficia Note
									</CardTitle>

									<div className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
										{notes.length} notes
									</div>
								</div>

								<p className="mt-1 text-sm text-slate-500">
									Your modern workspace for quick and simple notes
								</p>
							</div>
						</div>

						{/* Nút chuyển đổi View Mode & Thêm Note */}
						<div className="flex items-center justify-end gap-3">
							<div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
								<button
									onClick={() => setViewMode("grid")}
									className={`rounded-md p-1.5 transition-colors ${
										viewMode === "grid"
											? "bg-indigo-50 text-indigo-600"
											: "text-slate-400 hover:text-slate-600"
									}`}
									title="Hiển thị dạng lưới"
								>
									<LayoutGrid className="h-4 w-4" />
								</button>
								<button
									onClick={() => setViewMode("list")}
									className={`rounded-md p-1.5 transition-colors ${
										viewMode === "list"
											? "bg-indigo-50 text-indigo-600"
											: "text-slate-400 hover:text-slate-600"
									}`}
									title="Hiển thị dạng danh sách"
								>
									<List className="h-4 w-4" />
								</button>
							</div>
							<CreateNote />
						</div>
					</div>
				</div>

				{/* Search */}
				<div className="sticky top-23 z-10 w-full px-4 pt-4 backdrop-blur-sm sm:px-6">
					<SearchBar />
				</div>

				{/* Notes */}
				<div className="flex-1 overflow-y-auto px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
					{notes && notes.length > 0 ? (
						/* Đổi class Grid tĩnh thành cấu trúc thay đổi động theo viewMode */
						<div
							className={
								viewMode === "grid"
									? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
									: "flex flex-col gap-3 max-w-4xl mx-auto w-full"
							}
						>
							{notes.map((note) => (
								<Card
									key={note.id}
									onClick={() => router.get(route("notes.edit", note.id))}
									className={`${
										noteColors[note.id % noteColors.length]
									} cursor-pointer border-white/60 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
										viewMode === "list"
											? "flex flex-row items-center justify-between p-4"
											: ""
									}`}
								>
									{/* Bố cục cấu trúc bên trong thẻ Card thay đổi theo viewMode */}
									{viewMode === "grid" ? (
										<>
											<CardHeader className="p-4 pb-2">
												<CardTitle className="line-clamp-1 wrap-break-word text-lg text-slate-700">
													{note.title || "Ghi chú không tiêu đề"}
												</CardTitle>
											</CardHeader>

											<CardContent className="p-4 pt-0">
												<p className="line-clamp-3 wrap-break-word text-sm leading-relaxed text-slate-500/90">
													{note.content || "Không có nội dung chi tiết..."}
												</p>

												<div className="mt-4 inline-flex rounded-full bg-white/70 px-2 py-1 text-xs text-slate-500 shadow-sm">
													{new Date(note.updated_at!).toLocaleDateString(
														"vi-VN",
													)}
												</div>
											</CardContent>
										</>
									) : (
										/* Layout dạng LIST */
										<>
											<div className="flex flex-1 flex-col pr-4 min-w-0">
												<CardTitle className="line-clamp-1 wrap-break-word text-base font-semibold text-slate-700 mb-1">
													{note.title || "Ghi chú không tiêu đề"}
												</CardTitle>
												<p className="line-clamp-1 wrap-break-word text-sm text-slate-500/90">
													{note.content || "Không có nội dung chi tiết..."}
												</p>
											</div>

											<div className="flex shrink-0 items-center">
												<div className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-slate-500 shadow-xs border border-slate-100">
													{new Date(note.updated_at!).toLocaleDateString(
														"vi-VN",
													)}
												</div>
											</div>
										</>
									)}
								</Card>
							))}
						</div>
					) : (
						<div className="flex h-full items-center justify-center">
							<Card className="w-full max-w-md border border-dashed bg-white/80 ring-0 backdrop-blur-sm">
								<CardContent className="flex flex-col items-center px-4 py-10 text-center sm:py-12">
									<div className="relative mb-4 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-indigo-100">
										<FileText className="h-10 w-10 text-indigo-500" />
									</div>

									<h3 className="mb-2 text-lg font-semibold text-slate-900 sm:text-xl">
										Chưa có ghi chú nào
									</h3>

									<p className="mb-6 text-sm text-slate-500">
										Bắt đầu tạo ghi chú đầu tiên của bạn ngay bây giờ.
									</p>

									<CreateNote className="px-6" />
								</CardContent>
							</Card>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex flex-wrap items-center justify-between gap-2 border-t p-4 backdrop-blur-sm">
					<NavUser alwaysTop className="ml-auto max-w-64" user={user} />
				</div>
			</div>
		) : (
			<AuthenticationCard />
		),
	);
}
