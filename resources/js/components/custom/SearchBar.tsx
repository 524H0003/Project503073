import { IPage } from "@/lib/types";
import { router, usePage } from "@inertiajs/react";
import { Input } from "../ui/input";
import { ChangeEvent, SubmitEvent, useCallback, useState } from "react";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { route } from "ziggy-js";
import { CreateLabel } from "./CreateLabel";

export function SearchBar({ className = "" }) {
	const { filters, labels } = usePage<IPage>().props;
	const [search, setSearch] = useState(filters?.search || "");

	const handleSearch = useCallback(
		debounce((value) => {
			router.get(
				window.location.href,
				{ ...filters, search: value },
				{
					preserveState: true,
					preserveScroll: true,
					only: ["notes"],
				},
			);
		}, 300),
		[filters],
	);

	const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
		handleSearch(value);
	};

	const selectedLabels = Array.isArray(filters?.labels)
		? filters.labels.map(String)
		: [];

	const toggleLabel = (labelId: number) => {
		const idStr = String(labelId);

		const newLabels = selectedLabels.includes(idStr)
			? selectedLabels.filter((id) => id !== idStr)
			: [...selectedLabels, idStr];

		router.get(
			window.location.pathname,
			{
				...filters,
				labels: newLabels.length > 0 ? newLabels : null,
			},
			{
				preserveState: true,
				preserveScroll: true,
				only: ["notes", "filters"],
				replace: true,
			},
		);
	};

	return (
		<div className="flex flex-col gap-2">
			<Input
				className={className}
				type="text"
				placeholder="Tìm kiếm ghi chú..."
				value={search}
				onChange={onSearchChange}
			/>

			<div className="flex flex-wrap gap-2 mt-2 items-center">
				<CreateLabel>
					<button className="flex items-center justify-center size-5 rounded-full border border-dashed border-gray-400 hover:border-gray-600 hover:bg-gray-50 transition-all">
						<Plus className="size-2 text-gray-500" />
					</button>
				</CreateLabel>

				{/* Danh sách Labels hiện có */}
				{labels?.map((label) => {
					const isActive = selectedLabels.includes(String(label.id));
					return (
						<button
							key={label.id}
							onClick={() => toggleLabel(label.id)}
							className={cn(
								"px-3 py-1 text-xs rounded-full border transition-all duration-200",
								isActive
									? "bg-primary text-primary-foreground border-primary shadow-sm scale-105" // Trạng thái đang chọn
									: "bg-background text-muted-foreground border-input hover:border-gray-400 opacity-80", // Trạng thái chờ
							)}
						>
							{label.name}
						</button>
					);
				})}
			</div>
		</div>
	);
}
