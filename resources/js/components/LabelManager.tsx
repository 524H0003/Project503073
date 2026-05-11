import { SubmitEvent, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Check, TagIcon } from "lucide-react";
import { route } from "ziggy-js";
import { CreateLabel } from "./custom/CreateLabel";

export function LabelManagement() {
	const { labels } = usePage<any>().props;
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editName, setEditName] = useState("");

	const handleUpdate = (id: number, color: string) => {
		router.patch(
			route("labels.update", id),
			{
				name: editName,
				color: color,
			},
			{
				onSuccess: () => setEditingId(null),
			},
		);
	};

	const handleDelete = (id: number) => {
		if (confirm("Xóa nhãn này sẽ gỡ nó khỏi tất cả ghi chú. Bạn chắc chứ?")) {
			router.delete(route("labels.destroy", id));
		}
	};

	return (
		<Dialog>
			<DialogTrigger className="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
				<TagIcon className="h-4 w-4" />
				<span>Label Management</span>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>All Labels</DialogTitle>
				</DialogHeader>
				<CreateLabel></CreateLabel>
				<div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto pr-2">
					{labels.map((label: any) => (
						<div key={label.id} className="flex items-center gap-2 group">
							{editingId === label.id ? (
								<>
									<Input
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
										className="h-8"
										autoFocus
									/>
									<Button
										size="icon"
										variant="ghost"
										onClick={() => handleUpdate(label.id, label.color)}
									>
										<Check className="h-4 w-4 text-green-600" />
									</Button>
								</>
							) : (
								<>
									<div
										className="w-4 h-4 rounded-full shrink-0"
										style={{ backgroundColor: label.color }}
									/>
									<span className="flex-1 text-sm">{label.name}</span>
									<Button
										size="icon"
										variant="ghost"
										className="opacity-0 group-hover:opacity-100 h-8 w-8"
										onClick={() => {
											setEditingId(label.id);
											setEditName(label.name);
										}}
									>
										<TagIcon className="h-3 w-3" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive"
										onClick={() => handleDelete(label.id)}
									>
										<Trash2 className="h-3 w-3" />
									</Button>
								</>
							)}
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
