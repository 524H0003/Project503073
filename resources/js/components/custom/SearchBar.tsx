import { IPage } from "@/lib/types";
import { router, usePage } from "@inertiajs/react";
import { Input } from "../ui/input";
import { ChangeEvent, SubmitEvent, useCallback, useState } from "react";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react"; // Import icon
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { route } from "ziggy-js";

export function SearchBar({ className = "" }) {
	const { filters, labels } = usePage<IPage>().props;
	const [search, setSearch] = useState(filters?.search || "");

	// State cho việc tạo nhãn mới
	const [newLabelName, setNewLabelName] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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

	// Hàm gửi tạo Label mới
	const createLabel = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newLabelName.trim()) return;

		router.post(
			route("labels.store"),
			{
				name: newLabelName,
			},
			{
				onSuccess: () => {
					setNewLabelName("");
					setIsDialogOpen(false);
				},
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
				{/* Nút thêm Label mới */}
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<button className="flex items-center justify-center size-5 rounded-full border border-dashed border-gray-400 hover:border-gray-600 hover:bg-gray-50 transition-all">
							<Plus className="size-2 text-gray-500" />
						</button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-106.25">
						<DialogHeader>
							<DialogTitle>Tạo nhãn mới</DialogTitle>
						</DialogHeader>
						<form onSubmit={createLabel} className="space-y-4 pt-4">
							<Input
								placeholder="Tên nhãn (vd: Công việc, Học tập...)"
								value={newLabelName}
								onChange={(e) => setNewLabelName(e.target.value)}
								autoFocus
							/>
							<div className="flex justify-end">
								<Button type="submit">Tạo nhãn</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>

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
