import Layout from "@/components/layout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useCallback, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CloudCheck, CloudOff, Loader2 } from "lucide-react";
import _ from "lodash";
import { route } from "ziggy-js";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Edit({ note }: { note: Note }) {
  const [data, setData] = useState(note),
    [processing, setProcessing] = useState(false);

  function handleChange<T extends HTMLElement & { value: string }>(
    e: ChangeEvent<T>,
  ) {
    const key = e.target.id;
    const value = e.target.value;
    setData((values) => ({
      ...values,
      [key]: value,
    }));
  }

  const saveToServer = useCallback(
    _.debounce((updatedData) => {
      if (navigator.onLine) {
        router.put(route("notes.update", note.id), updatedData, {
          preserveScroll: true,
          preserveState: true,
        });
      } else {
        localStorage.setItem(
          `offline_note_${note.id}`,
          JSON.stringify(updatedData),
        );
        console.log("Đã lưu tạm offline");
      }

      setProcessing(false);
    }, 500),
    [note.id],
  );

  useEffect(() => {
    setProcessing(true);
    saveToServer(data);
  }, [data, saveToServer]);

  return Layout(
    <div className="max-w-4xl mx-auto p-6">
      <Head title={data.title} />

      <div className="flex items-center justify-end gap-2 mb-4 text-sm">
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
      </div>

      <div className="space-y-4 bg-white p-8 rounded-xl shadow-sm border min-h-[70vh]">
        <Input
          value={data.title}
          id="title"
          onChange={handleChange}
          placeholder="Tiêu đề..."
          className="text-3xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-slate-300"
        />

        <hr className="border-slate-100" />

        <Textarea
          value={data.content}
          id="content"
          onChange={handleChange}
          placeholder="Nội dung ghi chú..."
          className="min-h-125 border-none px-0 focus-visible:ring-0 resize-none text-lg leading-relaxed placeholder:text-slate-300"
        />
      </div>
    </div>,
  );
}
