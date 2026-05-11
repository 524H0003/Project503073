import Layout from "@/Layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookText } from "lucide-react";
import CreateNote from "@/components/CreateNoteButton";
import { router, usePage } from "@inertiajs/react";
import { IPage } from "@/lib/types";
import AuthenticationCard from "@/components/AuthenticationCard";
import { NavUser } from "@/components/sidebar/user";
import { route } from "ziggy-js";
import { SearchBar } from "@/components/custom/SearchBar";

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

  return Layout(
    user ? (
      <div className="flex flex-col h-full bg-[radial-gradient(circle_at_top_left,_#e0e7ff,_white,_#f8fafc)]">
        {/* Header / Toolbar */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/40 bg-white/70 backdrop-blur-xl p-4 sm:p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 transition-transform duration-200 hover:scale-110">
              <BookText className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <CardTitle className="text-slate-700 text-lg sm:text-xl">
                Efficia Note
              </CardTitle>

              <p className="text-sm text-slate-400">Your modern workspace</p>

              <div className="flex gap-2 mt-2">
                <div className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-700">
                  {notes.length} notes
                </div>
              </div>
            </div>
          </div>

          <CreateNote />
        </div>

        {/* Vùng hiển thị Grid */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-6 min-h-0">
          <div className="w-full px-4 sm:px-6 sticky top-0 z-10 backdrop-blur-sm">
            <SearchBar />
          </div>

          <div className="overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
            {notes && notes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {notes.map((note) => (
                  <Card
                    key={note.id}
                    onClick={() => router.get(route("notes.edit", note.id))}
                    className={`${
                      noteColors[note.id % noteColors.length]
                    } hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer border-white/60 shadow-sm backdrop-blur-sm`}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg line-clamp-1 break-words text-slate-700">
                        {note.title || "Ghi chú không tiêu đề"}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-slate-500/90 line-clamp-3 break-words leading-relaxed">
                        {note.content || "Không có nội dung chi tiết..."}
                      </p>

                      <div className="mt-4 inline-flex rounded-full bg-white/70 px-2 py-1 text-xs text-slate-500 shadow-sm">
                        {new Date(note.updated_at!).toLocaleDateString("vi-VN")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Card className="w-full max-w-md border-dashed border ring-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center py-10 sm:py-12 px-4 text-center">
                    <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 animate-pulse">
                      <FileText className="h-10 w-10 text-indigo-500" />
                    </div>

                    <h3 className="mb-2 text-lg sm:text-xl font-semibold text-slate-900">
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
        <div className="flex flex-wrap gap-2 p-4 border-t bg-white/80 backdrop-blur-sm justify-between items-center">
          <NavUser alwaysTop className="ml-auto max-w-64" user={user} />
        </div>
      </div>
    ) : (
      <AuthenticationCard />
    ),
  );
}
