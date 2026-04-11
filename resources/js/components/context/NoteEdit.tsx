import {
  createContext,
  useContext,
  useState,
  ReactNode,
  ChangeEvent,
} from "react";
import { router } from "@inertiajs/react";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import { route } from "ziggy-js";
import { Note } from "@/types/model";

interface NoteContextType {
  data: Note;
  processing: boolean;
  handleChange: <T extends HTMLElement & { value: string }>(
    e: ChangeEvent<T>,
  ) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({
  children,
  initialNote,
}: {
  children: ReactNode;
  initialNote: Note;
}) {
  const [data, setData] = useState<Note>(initialNote),
    [processing, setProcessing] = useState(false),
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

  useEffect(() => {
    setProcessing(true);
    saveToServer(data);
  }, [data, saveToServer]);

  return (
    <NoteContext.Provider value={{ data, processing, handleChange }}>
      {children}
    </NoteContext.Provider>
  );
}

export function useNote() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNote phải được dùng bên trong NoteProvider");
  }
  return context;
}
