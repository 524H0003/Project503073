import Layout from "@/Layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import CreateNote from "@/components/CreateNoteButton";
import { router, usePage } from "@inertiajs/react";
import { IPage } from "@/lib/types";
import AuthenticationCard from "@/components/AuthenticationCard";
import { NavUser } from "@/components/sidebar/user";
import { route } from "ziggy-js";
import { SearchBar } from "@/components/custom/SearchBar";

export default function Dashboard() {
	const { auth, notes } = usePage<IPage>().props,
		{ user } = auth;

	return Layout(
		user ? (
			<div className="flex flex-col h-full bg-slate-50/50">
				{/* Header / Toolbar (Tùy chọn) */}
				<div className="flex items-center justify-between p-6 pb-2">
					<CardTitle className="text-slate-600">Efficia Note</CardTitle>
					<CreateNote />
				</div>

				{/* Vùng hiển thị Grid */}
				<div className="flex-1 flex flex-col gap-6">
					<div className="w-full px-6">
						<SearchBar />
					</div>

					<div className="overflow-y-auto p-6">
						{notes && notes.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
								{notes.map((note) => (
									<Card
										key={note.id}
										onClick={() => router.get(route("notes.edit", note.id))}
										className="hover:shadow-md transition-shadow cursor-pointer border-slate-200"
									>
										<CardHeader className="p-4 pb-2">
											<CardTitle className="text-lg line-clamp-1">
												{note.title || "Ghi chú không tiêu đề"}
											</CardTitle>
										</CardHeader>
										<CardContent className="p-4 pt-0">
											<p className="text-sm text-slate-500 line-clamp-3">
												{note.content || "Không có nội dung chi tiết..."}
											</p>
											<div className="mt-4 text-xs text-slate-400">
												{new Date(note.updated_at!).toLocaleDateString("vi-VN")}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							/* Nếu vẫn không có ghi chú nào thì mới hiện cái Card thông báo cũ của bạn */
							<div className="flex h-full items-center justify-center">
								<Card className="w-full max-w-md border-dashed border ring-0">
									<CardContent className="flex flex-col items-center py-12 text-center">
										<div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
											<FileText className="h-10 w-10 text-slate-400" />
										</div>
										<h3 className="mb-2 text-xl font-semibold text-slate-900">
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
				</div>
				{/* Footer */}
				<div className="flex p-4 border-t bg-white justify-between items-center">
					<NavUser alwaysTop className="ml-auto max-w-64" user={user} />
				</div>
			</div>
		) : (
			<AuthenticationCard />
		),
	);
}
