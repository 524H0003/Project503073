import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNote } from "@/components/context/NoteEdit";
import { useEffect } from "react";
import { BoldIcon, Heading1Icon, ItalicIcon } from "lucide-react";

export function Editor() {
	const { data, setData } = useNote();

	const editor = useEditor({
		extensions: [StarterKit],
		editorProps: {
			attributes: {
				class: "outline-none h-full",
			},
		},
		content: data.content,
		onUpdate: ({ editor }) => {
			setData({ ...data, content: editor.getHTML() });
		},
	});

	useEffect(() => {
		if (editor && data.content !== editor.getHTML()) {
			editor.commands.setContent(data.content || "");
		}
	}, [data.content, editor]);

	if (!editor) return null;

	return (
		<div className="h-full flex flex-col">
			<div className="border-b p-2 flex gap-2 bg-gray-50">
				<button
					onClick={() => editor.chain().focus().toggleBold().run()}
					className="p-1 hover:bg-gray-200 rounded"
				>
					<BoldIcon />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className="p-1 hover:bg-gray-200 rounded"
				>
					<ItalicIcon />
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					className="p-1 hover:bg-gray-200 rounded"
				>
					<Heading1Icon />
				</button>
			</div>

			<EditorContent
				editor={editor}
				className="max-w-none overflow-auto p-2 flex-1 overflow-y-auto"
			/>
		</div>
	);
}
