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

  return <>a</>;
}
