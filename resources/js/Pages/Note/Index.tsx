import Layout from "@/Layouts/MainLayout";
import { Head, router } from "@inertiajs/react";
import { Note } from "@/types/model";
import { NoteProvider, useNote } from "@/components/context/NoteEdit";
import { Editor } from "./editor";

export default function Edit({ note }: { note: Note }) {
  return (
    <NoteProvider initialNote={note}>
      <Head title={note.title} />
      {Layout(<Editor />)}
    </NoteProvider>
  );
}
