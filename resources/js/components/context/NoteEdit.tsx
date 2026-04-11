import {
  createContext,
  useContext,
  useState,
  ReactNode,
  ChangeEvent,
} from "react";
import { Note } from "@/types/model";

interface NoteContextType {
  data: Note;
  processing: boolean;
  setProcessing: (val: boolean) => void;
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
  const [data, setData] = useState<Note>(initialNote);
  const [processing, setProcessing] = useState(false);

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

  return (
    <NoteContext.Provider
      value={{ data, processing, setProcessing, handleChange }}
    >
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
