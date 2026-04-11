import Layout from "@/Layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import CreateNote from "@/components/CreateNoteButton";

export default function Dashboard() {
  return Layout(
    <div className="flex h-full w-full items-center justify-center p-8">
      <Card className="w-full max-w-md border-dashed  border ring-0">
        <CardContent className="flex flex-col items-center  py-12 text-center">
          {/* Icon minh họa */}
          <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-10 w-10 text-slate-400" />
          </div>

          {/* Nội dung thông báo */}
          <h3 className="mb-2 text-xl font-semibold text-slate-900">
            Chưa có ghi chú nào được chọn
          </h3>
          <p className="mb-6 text-sm text-slate-500">
            Hãy chọn một ghi chú từ danh sách bên trái để xem nội dung chi tiết
            hoặc bắt đầu tạo một ghi chú mới ngay bây giờ.
          </p>

          {/* Nút hành động nhanh */}
          <div className="flex gap-3">
            <CreateNote className="px-6" />
          </div>
        </CardContent>
      </Card>
    </div>,
  );
}
