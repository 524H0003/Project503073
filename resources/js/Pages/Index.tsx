import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CornerDownLeft, Plus, Search, Trash2 } from "lucide-react";

// Dữ liệu mẫu cho danh sách ghi chú
const notes = [
  {
    id: 1,
    title: "Ý tưởng dự án mới",
    date: "10:30 AM",
    preview: "Xây dựng ứng dụng ghi chú giống iOS...",
  },
  {
    id: 2,
    title: "Danh sách mua sắm",
    date: "Hôm qua",
    preview: "Sữa, trứng, bánh mì, rau củ...",
  },
  {
    id: 3,
    title: "Ghi chú cuộc họp",
    date: "Thứ 2",
    preview: "Thảo luận về kế hoạch marketing tháng 4...",
  },
  {
    id: 4,
    title: "Học React & Inertia",
    date: "2 ngày trước",
    preview: "Tìm hiểu cách kết nối Laravel và React...",
  },
];

export default function Dashboard() {
  const [selectedNoteId, setSelectedNoteId] = React.useState(1);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* -- COLUMN 1: NOTE LIST -- */}
      <div className="w-[360px] border-r flex flex-col">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Notes</h1>
            <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm" className="pl-9 bg-muted/50" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`cursor-pointer border-none shadow-none hover:bg-muted/50 ${selectedNoteId === note.id ? "bg-muted" : ""}`}
                onClick={() => setSelectedNoteId(note.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    {note.title}
                    <span className="text-xs font-normal text-muted-foreground">
                      {note.date}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-xs text-muted-foreground line-clamp-2">
                  {note.preview}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* -- COLUMN 2: EDITOR (Khu vực soạn thảo) -- */}
      <div className="flex-1 flex flex-col bg-muted/10">
        <div className="h-16 border-b flex items-center justify-end px-6 gap-2">
          <Button size="icon" variant="ghost">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        {/* Khu vực nội dung ghi chú (iOS style: không đường viền) */}
        <textarea
          className="flex-1 p-8 bg-transparent focus:outline-none resize-none text-sm leading-relaxed"
          placeholder="Bắt đầu viết ghi chú..."
          defaultValue={
            notes.find((n) => n.id === selectedNoteId)?.preview +
            "\n\nĐây là nội dung chi tiết của ghi chú..."
          }
        />

        {/* Thanh trạng thái nhỏ ở dưới cùng */}
        <div className="h-10 border-t flex items-center justify-between px-6 text-xs text-muted-foreground">
          <span>{notes.find((n) => n.id === selectedNoteId)?.date}</span>
          <span>120 ký tự</span>
        </div>
      </div>
    </div>
  );
}
