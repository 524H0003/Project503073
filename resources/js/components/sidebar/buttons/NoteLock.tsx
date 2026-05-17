import { useNote } from "@/components/context/NoteEdit";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { router, useForm } from "@inertiajs/react";
import { KeyRound, Loader2, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { route } from "ziggy-js";

export default function NoteLock() {
	const { data, setData } = useNote();

	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

	const passwordForm = useForm({
		password: "",
	});

	const handleUnlock = (e: React.FormEvent) => {
		e.preventDefault();
		passwordForm.post(route("notes.unlock", data.id), {
			onSuccess: (page) => {
				setIsPasswordModalOpen(false);

				const updatedNote = page.props.note as any;

				if (updatedNote) {
					setData({
						...data,
						is_opened: updatedNote.is_opened,
						content: updatedNote.content ?? "",
						title: updatedNote.title ?? "",
					});
				}

				passwordForm.reset();
			},
		});
	};

	const handleSetPassword = (e: React.FormEvent) => {
		e.preventDefault();
		passwordForm.patch(route("notes.update", data.id), {
			onSuccess: () => {
				setIsPasswordModalOpen(false);
				setData({ ...data, is_opened: false, is_locked: true, content: null! });
				passwordForm.reset();
			},
		});
	};

	const handleLockManual = () => {
		router.post(route("notes.lock", data.id));
		setData({ ...data, is_opened: false, content: null! });
	};

	const isCurrentlyLocked = !data.is_opened;

	return (
		<>
			{data.is_locked ? (
				isCurrentlyLocked ? (
					<Button
						variant="outline"
						className="justify-start gap-2 border-none bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100"
						onClick={() => setIsPasswordModalOpen(true)}
					>
						<Unlock className="h-4 w-4" />
						Mở khóa ghi chú
					</Button>
				) : (
					<Button
						variant="outline"
						className="justify-start gap-2 border-none bg-amber-50/50 text-amber-600 hover:bg-amber-100"
						onClick={handleLockManual}
					>
						<Lock className="h-4 w-4" />
						Khóa lại ngay
					</Button>
				)
			) : (
				<Button
					variant="outline"
					className="justify-start gap-2 border-none bg-transparent hover:bg-indigo-50"
					onClick={() => setIsPasswordModalOpen(true)}
				>
					<KeyRound className="h-4 w-4" />
					Đặt mật khẩu
				</Button>
			)}

			<Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
				<DialogContent className="sm:max-w-md rounded-3xl backdrop-blur-2xl bg-white/80 border-white/40">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Lock className="h-5 w-5 text-indigo-500" />
							{/* Đổi tiêu đề dựa theo trạng thái */}
							{data.is_locked
								? "Nhập mật khẩu để xem"
								: "Thiết lập mật khẩu bảo mật"}
						</DialogTitle>
					</DialogHeader>

					<form
						onSubmit={data.is_locked ? handleUnlock : handleSetPassword}
						className="space-y-4 py-4"
					>
						<div className="space-y-2">
							<Input
								type="password"
								placeholder={
									data.is_locked ? "Mật khẩu..." : "Nhập mật khẩu mới..."
								}
								value={passwordForm.data.password}
								onChange={(e) =>
									passwordForm.setData("password", e.target.value)
								}
								autoFocus
								className="rounded-xl border-indigo-100 focus-visible:ring-indigo-400"
							/>
							{!data.is_locked && (
								<p className="text-[10px] text-slate-500 px-1">
									* Mật khẩu này sẽ bảo vệ nội dung ghi chú của bạn.
								</p>
							)}
						</div>

						{passwordForm.errors.password && (
							<p className="text-xs text-red-500 font-medium">
								{passwordForm.errors.password}
							</p>
						)}

						<DialogFooter>
							<Button
								type="submit"
								disabled={passwordForm.processing}
								className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
							>
								{passwordForm.processing ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : data.is_locked ? (
									"Mở khóa"
								) : (
									"Lưu mật khẩu"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
