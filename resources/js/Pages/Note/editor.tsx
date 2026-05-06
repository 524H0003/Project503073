import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNote } from "@/components/context/NoteEdit";
import { useEffect, useRef } from "react";
import { BoldIcon, Heading1Icon, ImagePlus, ItalicIcon } from "lucide-react";
import Image from "@tiptap/extension-image";
import { uploadImage } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { ResizableImage } from "tiptap-extension-resizable-image";

export function Editor() {
	const { data, setData } = useNote();

	const editor = useEditor({
		extensions: [
			StarterKit,
			ResizableImage.configure({
				defaultWidth: 200,
				defaultHeight: 200,
			}),
			Image.configure({ inline: true }),
		],
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

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				alert("Vui lòng chỉ chọn file hình ảnh!");
				return;
			}

			const result = await uploadImage(file, data.id.toString());

			if (result == null) return;

			editor?.chain().focus().setImage({ src: result }).run();
		}
	};

	if (!editor) return null;

	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="h-full flex flex-col">
			<Head title={data.title} />
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept="image/*"
				className="hidden"
			/>

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
				<button
					onClick={() => fileInputRef.current?.click()} // Kích hoạt input file ẩn
					title="Chèn hình ảnh"
					className="p-1 rounded hover:bg-gray-200"
				>
					<ImagePlus />
				</button>
			</div>

			<EditorContent
				editor={editor}
				className="max-w-none overflow-auto p-2 flex-1 overflow-y-auto"
			/>
		</div>
	);
}
