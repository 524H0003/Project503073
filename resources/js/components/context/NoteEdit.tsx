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

	const [data, setData] = useState<NoteForm>({
			...note,
			labels: note?.labels!.map((l) => l.id.toString()),
		}),
		[processing, setProcessing] = useState(false),
		saveToServer = useCallback(
			debounce((updatedData) => {
				if (
					!data.id ||
					!data.is_opened ||
					data.current_user_permission !== "edit"
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
	}, [data?.title, data?.content, data?.labels, saveToServer]);

	useEffect(
		() =>
			setData({ ...note, labels: note?.labels!.map((l) => l.id.toString()) }),
		[noteId],
	);

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
