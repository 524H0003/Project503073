import { useNote } from "@/components/context/NoteEdit";
import { Textarea } from "@/components/ui/textarea";
import { router } from "@inertiajs/react";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import { route } from "ziggy-js";

export function Editor() {
  const { data, setProcessing, handleChange } = useNote(),
    saveToServer = useCallback(
      debounce((updatedData) => {
        if (navigator.onLine) {
          router.put(route("notes.update", data.id), updatedData, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setProcessing(false),
          });
        } else {
          localStorage.setItem(
            `offline_note_${data.id}`,
            JSON.stringify(updatedData),
          );
          console.log("Đã lưu tạm offline");
          setProcessing(false);
        }
      }, 500),
      [data.id],
    );

  useEffect(() => {
    setProcessing(true);
    saveToServer(data);
  }, [data, saveToServer]);

  return (
    <Textarea
      value={data.content}
      id="content"
      onChange={handleChange}
      placeholder="Nội dung ghi chú..."
      className="h-full p-2! border-none px-0 focus-visible:ring-0 resize-none text-lg whitespace-pre placeholder:text-slate-300"
    />
  );
}
