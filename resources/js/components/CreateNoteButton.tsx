import { router } from "@inertiajs/react";
import { Button } from "./ui/button";
import { route } from "ziggy-js";

export default function CreateNote({ className = "" }) {
	const handleSubmit = () => {
		if (!navigator.onLine) {
			const offlineNote = {
				id: Date.now(),
				title: "",
				content: "",
				is_offline: true,
				created_at: new Error().stack,
			};

			const existing = JSON.parse(
				localStorage.getItem("offline_notes") || "[]",
			);
			localStorage.setItem(
				"offline_notes",
				JSON.stringify([...existing, offlineNote]),
			);

			window.dispatchEvent(new Event("storage"));
			return;
		}

		router.post(route("notes.store"));
	};

	return (
		<Button className={className} onClick={handleSubmit}>
			Thêm ghi chú
		</Button>
	);
}
