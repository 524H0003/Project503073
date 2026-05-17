import { useForm, usePage } from "@inertiajs/react";
import { FormEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { route } from "ziggy-js";
import MainLayout from "@/Layouts/MainLayout";
import { IPage } from "@/lib/types";

export default function Edit() {
	const { user } = usePage<IPage>().props;
	const avatarInput = useRef<HTMLInputElement>(null);

	const profileForm = useForm({
		name: user.name,
		email: user.email,
		avatar: null as File | null,
	});

	// Form đổi mật khẩu
	const passwordForm = useForm({
		current_password: "",
		password: "",
		password_confirmation: "",
	});

	// Form cấu hình
	const prefsForm = useForm({
		theme: user.preferences?.theme || "light",
		font_size: user.preferences?.font_size || "base",
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			// 1. Giới hạn dung lượng (ví dụ: 2MB)
			const fileSizeInMB = file.size / 1024 / 1024;
			if (fileSizeInMB > 2) {
				alert("File quá lớn! Vui lòng chọn file dưới 2MB.");
				e.target.value = ""; // Reset input
				return;
			}

			// 2. Giới hạn định dạng (Mime types)
			const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
			if (!allowedTypes.includes(file.type)) {
				alert("Chỉ chấp nhận định dạng JPG hoặc PNG.");
				e.target.value = "";
				return;
			}

			profileForm.setData("avatar", file);
		}
	};

	const updateProfile = (e: FormEvent) => {
		e.preventDefault();
		profileForm.post(route("profile.update"), {
			onSuccess: () => toast.success("Cập nhật thông tin thành công!"),
		});
	};

	const updatePassword = (e: FormEvent) => {
		e.preventDefault();
		passwordForm.put(route("profile.password.update"), {
			onSuccess: () => {
				passwordForm.reset();
				toast.success("Đổi mật khẩu thành công!");
			},
		});
	};

	const updatePrefs = (e: FormEvent) => {
		e.preventDefault();
		prefsForm.put(route("profile.preferences.update"), {
			onSuccess: () => toast.success("Đã lưu cấu hình!"),
		});
	};

	return MainLayout(
		<div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
			<h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>

			{/* SECTION: THÔNG TIN CÁ NHÂN */}
			<Card>
				<CardHeader>
					<CardTitle>Thông tin cá nhân</CardTitle>
					<CardDescription>
						Cập nhật tên, email và ảnh đại diện của bạn.
					</CardDescription>
				</CardHeader>
				<form onSubmit={updateProfile}>
					<CardContent className="space-y-6">
						<div className="flex items-center gap-6">
							<div className="relative group">
								<Avatar className="h-24 w-24 border">
									<AvatarImage
										src={user.avatar ? `/storage/${user.avatar}` : ""}
									/>
									<AvatarFallback className="text-2xl">
										{user.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<button
									type="button"
									onClick={() => avatarInput.current?.click()}
									className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white"
								>
									<Camera className="h-6 w-6" />
								</button>
								<input
									type="file"
									ref={avatarInput}
									className="hidden"
									onChange={handleFileChange}
								/>
							</div>
							<div className="space-y-1 text-sm">
								<p className="font-medium">Ảnh đại diện</p>
								<p className="text-muted-foreground">JPG, PNG tối đa 2MB.</p>
								{profileForm.data.avatar && (
									<p className="text-blue-500 font-medium">
										Đã chọn: {profileForm.data.avatar.name}
									</p>
								)}
							</div>
						</div>

						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Họ và tên</Label>
								<Input
									id="name"
									value={profileForm.data.name}
									onChange={(e) => profileForm.setData("name", e.target.value)}
								/>
								{profileForm.errors.name && (
									<p className="text-xs text-red-500">
										{profileForm.errors.name}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={profileForm.data.email}
									onChange={(e) => profileForm.setData("email", e.target.value)}
								/>
								{profileForm.errors.email && (
									<p className="text-xs text-red-500">
										{profileForm.errors.email}
									</p>
								)}
							</div>
						</div>
					</CardContent>
					<CardFooter className="border-t px-6 py-4">
						<Button disabled={profileForm.processing}>
							{profileForm.processing && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Lưu thông tin
						</Button>
					</CardFooter>
				</form>
			</Card>

			{/* SECTION: ĐỔI MẬT KHẨU */}
			<Card>
				<CardHeader>
					<CardTitle>Đổi mật khẩu</CardTitle>
					<CardDescription>
						Đảm bảo tài khoản của bạn đang sử dụng một mật khẩu dài và ngẫu
						nhiên.
					</CardDescription>
				</CardHeader>
				<form onSubmit={updatePassword}>
					<CardContent className="space-y-4">
						<div className="grid gap-2">
							<Label htmlFor="current_password">Mật khẩu hiện tại</Label>
							<Input
								id="current_password"
								type="password"
								value={passwordForm.data.current_password}
								onChange={(e) =>
									passwordForm.setData("current_password", e.target.value)
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Mật khẩu mới</Label>
							<Input
								id="password"
								type="password"
								value={passwordForm.data.password}
								onChange={(e) =>
									passwordForm.setData("password", e.target.value)
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
							<Input
								id="password_confirmation"
								type="password"
								value={passwordForm.data.password_confirmation}
								onChange={(e) =>
									passwordForm.setData("password_confirmation", e.target.value)
								}
							/>
						</div>
					</CardContent>
					<CardFooter className="border-t px-6 py-4">
						<Button variant="secondary" disabled={passwordForm.processing}>
							Đổi mật khẩu
						</Button>
					</CardFooter>
				</form>
			</Card>

			{/* SECTION: CẤU HÌNH GIAO DIỆN */}
			<Card>
				<CardHeader>
					<CardTitle>Cấu hình giao diện</CardTitle>
					<CardDescription>
						Tùy chỉnh trải nghiệm đọc và nhìn của bạn.
					</CardDescription>
				</CardHeader>
				<form onSubmit={updatePrefs}>
					<CardContent className="grid sm:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Label>Giao diện (Theme)</Label>
							<Select
								value={prefsForm.data.theme}
								onValueChange={(val) => prefsForm.setData("theme", val)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Chọn theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">Sáng (Light)</SelectItem>
									<SelectItem value="dark">Tối (Dark)</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Cỡ chữ (Font Size)</Label>
							<Select
								value={prefsForm.data.font_size}
								onValueChange={(val) => prefsForm.setData("font_size", val)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Chọn cỡ chữ" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="sm">Nhỏ</SelectItem>
									<SelectItem value="base">Vừa</SelectItem>
									<SelectItem value="lg">Lớn</SelectItem>
									<SelectItem value="xl">Cực lớn</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
					<CardFooter className="border-t px-6 py-4">
						<Button variant="outline">Lưu cấu hình</Button>
					</CardFooter>
				</form>
			</Card>
		</div>,
	);
}
