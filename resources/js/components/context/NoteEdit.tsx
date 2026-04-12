import {
	createContext,
	useContext,
	useState,
	ChangeEvent,
	PropsWithChildren,
} from "react";
import { router, usePage } from "@inertiajs/react";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import { route } from "ziggy-js";
import { Note } from "@/types/model";

interface NoteContextType {
	data: Note;
	processing: boolean;
	// setData: (input: SetStateAction<Note>) => void;
	handleChange: <T extends HTMLElement & { value: string }>(
		e: ChangeEvent<T>,
	) => void;
}

const NoteContext = createContext<NoteContextType>(null!);

export function NoteProvider({ children }: PropsWithChildren) {
	const { note } = usePage<{ note: Note }>().props;

	const [data, setData] = useState<Note>(note || {}),
		[processing, setProcessing] = useState(false),
		saveToServer = useCallback(
			debounce((updatedData) => {
				if (!data.id) return;

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
			[],
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
	}, [data.title, data.content, saveToServer]);

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
