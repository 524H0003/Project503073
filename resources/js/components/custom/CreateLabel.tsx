import { PropsWithChildren, SubmitEvent, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export function CreateLabel(input: PropsWithChildren) {
	const { errors } = usePage().props;
	const [newLabelName, setNewLabelName] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				{input.children ? input.children : <Button>New Label</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>Create new label</DialogTitle>
				</DialogHeader>
				<form onSubmit={createLabel} className="space-y-4 pt-4">
					<Input
						placeholder="Label name"
						value={newLabelName}
						onChange={(e) => setNewLabelName(e.target.value)}
						autoFocus
						className={cn(
							errors.name && "border-red-500 focus-visible:ring-red-500",
						)}
					/>
					{errors.name && (
						<p className="text-xs text-red-500 font-medium ml-1">
							{errors.name}
						</p>
					)}
					<div className="flex justify-end">
						<Button type="submit">Create</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
