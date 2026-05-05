import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { route } from "ziggy-js";

import axios from "axios";
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function uploadImage(file: Blob, noteId: string): Promise<string | null> {
	const formData = new FormData();
	formData.append("image", file);

	const MAX_SIZE = 5 * 1024 * 1024;

	if (file.size > MAX_SIZE) {
		alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.");
		return null;
	}

	const response = await axios.post(route("notes.upload-image", noteId), formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data.url;
}
