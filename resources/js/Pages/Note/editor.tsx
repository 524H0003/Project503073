import { useNote } from "@/components/context/NoteEdit";
import { Textarea } from "@/components/ui/textarea";

export function Editor() {
	const { data, handleChange } = useNote();

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
