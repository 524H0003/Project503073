import {
	createContext,
	useContext,
	useState,
	ChangeEvent,
	PropsWithChildren,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { router, usePage } from "@inertiajs/react";
import { debounce } from "lodash";
import { route } from "ziggy-js";
import { Note } from "@/types/model";
import { IPage } from "@/lib/types";

export type NoteForm = Omit<Note, "labels"> & { labels: string[] };

interface NoteContextType {
	data: NoteForm;
	processing: boolean;
	handleChange: <T extends HTMLElement & { value: string }>(
		e: ChangeEvent<T>,
	) => void;
	setData: React.Dispatch<React.SetStateAction<NoteForm>>;
}

const NoteContext = createContext<NoteContextType>(null!);

export function NoteProvider({ children }: PropsWithChildren) {
	const { url } = usePage(),
		noteId = Number(url.split("/")[2]),
		{ note } = usePage<{ note: Note } & IPage>().props;

	const [data, setData] = useState<NoteForm>(() => ({
		...note,
		labels: note?.labels!.map((l) => l.id.toString()) || [],
	}));
	const [processing, setProcessing] = useState(false);

	// Cờ kiểm soát tránh vòng lặp tự động lưu khi nhận dữ liệu từ WebSocket
	const isIncomingUpdateRef = useRef(false);
	// Lưu noteId hiện tại để kiểm soát khi đổi trang
	const currentNoteIdRef = useRef<number>(noteId);

	// 1. Logic lưu dữ liệu lên server (Đã sửa lỗi biến `data` thành `updatedData` bên trong hàm)
	const saveToServer = useCallback(
		debounce((updatedData: NoteForm) => {
			if (
				!updatedData.id ||
				!updatedData.is_opened ||
				!["edit", "owner"].some((i) => updatedData.current_user_permission == i)
			)
				return;

			if (navigator.onLine) {
				router.put(route("notes.update", updatedData.id), updatedData, {
					preserveScroll: true,
					preserveState: true,
					onFinish: () => setProcessing(false),
				});
			} else {
				localStorage.setItem(
					`offline_note_${updatedData.id}`,
					JSON.stringify(updatedData),
				);
				console.log("Đã lưu tạm offline");
				setProcessing(false);
			}
		}, 500),
		[],
	);

	// 2. 🟢 LẮNG NGHE WEBSOCKET REAL-TIME TỪ LARAVEL REVERB
	useEffect(() => {
		if (!noteId || isNaN(noteId)) return;
		if (!window.Echo) {
			console.error("Laravel Echo chưa được khởi tạo ở bootstrap.ts");
			return;
		}

		console.log(
			`[WebSocket]: Đang kết nối vào phòng private 'notes.${noteId}'`,
		);

		const channel = window.Echo.private(`notes.${noteId}`).listen(
			".NoteUpdated",
			(e: { note: Note }) => {
				const incomingNote = e.note;

				setData((prev) => {
					// Nếu thời gian cập nhật trùng nhau, không cập nhật lại giao diện
					if (prev.updated_at === incomingNote.updated_at) {
						return prev;
					}

					console.log("[WebSocket]: Nhận cập nhật mới từ client khác.");
					// Đánh dấu đây là dữ liệu từ server đổ về, không được tự động trigger saveToServer
					isIncomingUpdateRef.current = true;

					return {
						...prev,
						title: incomingNote.title,
						content: incomingNote.content,
						labels: incomingNote.labels?.map((l) => l.id.toString()) || [],
						shared_users: incomingNote.shared_users,
						updated_at: incomingNote.updated_at,
					};
				});
			},
		);

		// Hủy lắng nghe khi người dùng chuyển trang hoặc tắt component
		return () => {
			console.log(`[WebSocket]: Đã rời phòng 'notes.${noteId}'`);
			window.Echo.leave(`notes.${noteId}`);
		};
	}, [noteId]);

	// 3. Hàm xử lý khi người dùng gõ phím thay đổi form
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
		if (isIncomingUpdateRef.current) {
			isIncomingUpdateRef.current = false;
			return;
		}

		if (currentNoteIdRef.current !== noteId) {
			return;
		}

		setProcessing(true);
		saveToServer(data);
	}, [data.title, data.content, data.labels, saveToServer, noteId]);

	useEffect(() => {
		if (note && currentNoteIdRef.current !== noteId) {
			currentNoteIdRef.current = noteId;
			isIncomingUpdateRef.current = true;
			setData({
				...note,
				labels: note.labels!.map((l) => l.id.toString()) || [],
			});
		}
	}, [noteId, note]);

	return (
		<NoteContext.Provider
			value={{
				data,
				processing,
				handleChange,
				setData,
			}}
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
