import Layout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { Note } from "@/types/model";
import { Editor } from "./editor";

export default function Edit({ note }: { note: Note }) {
	return (
		<>
			<Head title={note.title} />
			{Layout(<Editor />)}
		</>
	);
}
