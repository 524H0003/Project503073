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
	const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
		useState(false);

	const passwordForm = useForm({
		password: "",
	});

	const changePasswordForm = useForm({
		new_password: "",
		new_password_confirmation: "",
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

	const handleChangePassword = (e: React.FormEvent) => {
		e.preventDefault();
		changePasswordForm.post(route("notes.changePassword", data.id), {
			onSuccess: () => {
				setIsChangePasswordModalOpen(false);
				changePasswordForm.reset();
				alert("Đổi mật khẩu ghi chú thành công!");
			},
		});
	};

	const isCurrentlyLocked = !data.is_opened;

	return (
		<>
			<div className="flex flex-col gap-2">
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
						<>
							<Button
								variant="outline"
								className="justify-start gap-2 border-none bg-amber-50/50 text-amber-600 hover:bg-amber-100"
								onClick={handleLockManual}
							>
								<Lock className="h-4 w-4" />
								Khóa lại ngay
							</Button>

							<Button
								variant="outline"
								className="justify-start gap-2 border-none bg-slate-100 text-slate-700 hover:bg-slate-200"
								onClick={() => setIsChangePasswordModalOpen(true)}
							>
								<KeyRound className="h-4 w-4" />
								Đổi mật khẩu
							</Button>
						</>
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
			</div>

			{/* --- DIALOG 1: UNLOCK HOẶC SET PASSWORD LẦN ĐẦU --- */}
			<Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
				<DialogContent className="sm:max-w-md rounded-3xl backdrop-blur-2xl bg-white/80 border-white/40">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Lock className="h-5 w-5 text-indigo-500" />
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

			{/* --- DIALOG 2: ĐỔI MẬT KHẨU (Chỉ kích hoạt khi ghi chú đang mở) --- */}
			<Dialog
				open={isChangePasswordModalOpen}
				onOpenChange={setIsChangePasswordModalOpen}
			>
				<DialogContent className="sm:max-w-md rounded-3xl backdrop-blur-2xl bg-white/80 border-white/40">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<KeyRound className="h-5 w-5 text-indigo-500" />
							Thay đổi mật khẩu ghi chú
						</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleChangePassword} className="space-y-4 py-4">
						{/* Ô nhập mật khẩu mới */}
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-600 px-1">
								Mật khẩu mới
							</label>
							<Input
								type="password"
								placeholder="Nhập mật khẩu mới..."
								value={changePasswordForm.data.new_password}
								onChange={(e) =>
									changePasswordForm.setData("new_password", e.target.value)
								}
								className="rounded-xl border-indigo-100 focus-visible:ring-indigo-400"
							/>
							{changePasswordForm.errors.new_password && (
								<p className="text-xs text-red-500 font-medium pt-1">
									{changePasswordForm.errors.new_password}
								</p>
							)}
						</div>

						{/* Ô gõ lại mật khẩu mới để confirm */}
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-600 px-1">
								Xác nhận mật khẩu mới
							</label>
							<Input
								type="password"
								placeholder="Xác nhận mật khẩu mới..."
								value={changePasswordForm.data.new_password_confirmation}
								onChange={(e) =>
									changePasswordForm.setData(
										"new_password_confirmation",
										e.target.value,
									)
								}
								className="rounded-xl border-indigo-100 focus-visible:ring-indigo-400"
							/>
						</div>

						<DialogFooter className="pt-2">
							<Button
								type="submit"
								disabled={changePasswordForm.processing}
								className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
							>
								{changePasswordForm.processing ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Cập nhật mật khẩu"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
