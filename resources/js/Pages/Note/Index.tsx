import Layout from "@/Layouts/MainLayout";
import { Head, router } from "@inertiajs/react";
import { Note } from "@/types/model";
import { NoteProvider, useNote } from "@/components/context/NoteEdit";
import { Editor } from "./editor";

export default function Edit({ note }: { note: Note }) {
  return (
    <NoteProvider initialNote={note}>
      <Head title={note.title} />
      {Layout(
        // <div className="max-w-4xl mx-auto p-6">
        //   <div className="flex items-center justify-end gap-2 mb-4 text-sm">
        //   </div>

        //   <div className="space-y-4 bg-white p-8 rounded-xl shadow-sm border min-h-[70vh]">
        //     <Input
        //       value={data.title}
        //       id="title"
        //       onChange={handleChange}
        //       placeholder="Tiêu đề..."
        //       className="text-3xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-slate-300"
        //     />

        //     <hr className="border-slate-100" />

        //   </div>
        // </div>,
        <Editor />,
      )}
    </NoteProvider>
  );
}
