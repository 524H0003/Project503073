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
	const { data } = useNote();

	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

	const passwordForm = useForm({
		password: "",
	});

	const handleUnlock = (e: React.FormEvent) => {
		e.preventDefault();
		passwordForm.post(route("notes.unlock", data.id), {
			onSuccess: () => {
				setIsPasswordModalOpen(false);
				passwordForm.reset();
			},
		});
	};

	const handleLockManual = () => {
		router.post(route("notes.lock", data.id));
	};

	const isCurrentlyLocked = data.is_locked;

	return (
		<>
			{data.is_locked ? (
				// Nếu Note đã có mật khẩu trong DB
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
				// Nếu Note chưa có mật khẩu
				<Button
					variant="outline"
					className="justify-start gap-2 border-none bg-transparent hover:bg-indigo-50"
					onClick={() => {
						/* Logic để hiện modal Đặt mật khẩu lần đầu */
						setIsPasswordModalOpen(true);
					}}
				>
					<KeyRound className="h-4 w-4" />
					Đặt mật khẩu
				</Button>
			)}

			<Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
				<DialogContent className="sm:max-w-106.25 rounded-3xl backdrop-blur-2xl bg-white/80 border-white/40">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Lock className="h-5 w-5 text-indigo-500" />
							{data.is_locked ? "Nhập mật khẩu" : "Thiết lập mật khẩu"}
						</DialogTitle>
					</DialogHeader>

					<form
						onSubmit={data.is_locked ? handleUnlock : handleLockManual}
						className="space-y-4 py-4"
					>
						<Input
							type="password"
							placeholder="Nhập mật khẩu tại đây..."
							value={passwordForm.data.password}
							onChange={(e) => passwordForm.setData("password", e.target.value)}
							autoFocus
							className="rounded-xl border-indigo-100 focus-visible:ring-indigo-400"
						/>
						{passwordForm.errors.password && (
							<p className="text-xs text-red-500">
								{passwordForm.errors.password}
							</p>
						)}

						<DialogFooter>
							<Button
								type="submit"
								disabled={passwordForm.processing}
								className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
							>
								{passwordForm.processing ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Xác nhận"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
