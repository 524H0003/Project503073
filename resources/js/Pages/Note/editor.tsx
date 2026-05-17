import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNote } from "@/components/context/NoteEdit";
import { useEffect, useRef } from "react";
import {
	BoldIcon,
	Heading1Icon,
	ImagePlus,
	ItalicIcon,
	LockKeyhole,
} from "lucide-react";
import Image from "@tiptap/extension-image";
import { uploadImage } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { ResizableImage } from "tiptap-extension-resizable-image";

export function Editor() {
	const { data, setData } = useNote();

	const isEditable = data.current_user_permission == "edit";

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
		editable: isEditable, // Thiết lập trạng thái ban đầu cho Editor
		onUpdate: ({ editor }) => {
			setData({ ...data, content: editor.getHTML() });
		},
	});

	// Bổ sung useEffect để cập nhật trạng thái Editable của Tiptap khi dữ liệu thay đổi
	useEffect(() => {
		if (editor) {
			editor.setEditable(isEditable);
		}
	}, [isEditable, editor]);

	useEffect(() => {
		if (editor && data.content !== editor.getHTML()) {
			editor.commands.setContent(data.content || "");
		}
	}, [data.content, editor]);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (!isEditable) return;

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

	const isCurrentlyLocked = data.is_locked && !data.is_opened;

	if (isCurrentlyLocked) {
		return (
			<div className="h-full flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-300">
				<Head title="Ghi chú bị khóa bảo mật" />
				<div className="p-4 border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center max-w-sm w-full text-center space-y-4">
					<div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
						<LockKeyhole className="h-8 w-8" />
					</div>
					<div className="space-y-1">
						<h3 className="font-semibold text-lg">Ghi chú đã bị khóa</h3>
						<p className="text-sm px-2">
							Nội dung của ghi chú này đã được bảo mật. Vui lòng sử dụng tính
							năng mở khóa trên thanh điều khiển để truy cập nội dung.
						</p>
					</div>
				</div>
			</div>
		);
	}

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

			{isEditable && (
				<div className="border-b p-2 flex gap-2">
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
						onClick={() => fileInputRef.current?.click()}
						title="Chèn hình ảnh"
						className="p-1 rounded hover:bg-gray-200"
					>
						<ImagePlus />
					</button>
				</div>
			)}

			<EditorContent
				editor={editor}
				className={`max-w-none overflow-auto p-2 flex-1 overflow-y-auto ${!isEditable ? "prose-read-only" : ""}`}
			/>
		</div>
	);
}
