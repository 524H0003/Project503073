import { FormEvent, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { route } from "ziggy-js";

export default function ResetPassword({
	token,
	email,
}: {
	token: string;
	email: string;
}) {
	const { data, setData, post, processing, errors, reset } = useForm({
		token: token,
		email: email,
		password: "",
		password_confirmation: "",
	});

	// Xóa mật khẩu nếu có lỗi khi submit
	useEffect(() => {
		return () => {
			reset("password", "password_confirmation");
		};
	}, []);

	const submit = (e: FormEvent) => {
		e.preventDefault();
		post(route("password.update"));
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
			<Head title="Đặt lại mật khẩu" />

			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<div className="flex justify-center mb-2">
						<div className="p-3 bg-primary/10 rounded-full">
							<ShieldCheck className="h-6 w-6 text-primary" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold tracking-tight text-center">
						Thiết lập mật khẩu mới
					</CardTitle>
					<CardDescription className="text-center">
						Vui lòng nhập mật khẩu mới và xác nhận để hoàn tất quá trình.
					</CardDescription>
				</CardHeader>

				<form onSubmit={submit}>
					<CardContent className="space-y-4">
						{/* Token và Email thường được ẩn hoặc chỉ hiển thị Email dưới dạng ReadOnly */}
						<input type="hidden" name="token" value={data.token} />

						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								name="email"
								value={data.email}
								readOnly // Thường không cho sửa email ở bước này
								className="bg-slate-50 text-muted-foreground"
								onChange={(e) => setData("email", e.target.value)}
							/>
							{errors.email && (
								<p className="text-xs text-red-500 font-medium">
									{errors.email}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="password">Mật khẩu mới</Label>
							<Input
								id="password"
								type="password"
								name="password"
								value={data.password}
								autoComplete="new-password"
								className={errors.password ? "border-red-500" : ""}
								onChange={(e) => setData("password", e.target.value)}
								autoFocus
							/>
							{errors.password && (
								<p className="text-xs text-red-500 font-medium">
									{errors.password}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
							<Input
								id="password_confirmation"
								type="password"
								name="password_confirmation"
								value={data.password_confirmation}
								autoComplete="new-password"
								className={errors.password_confirmation ? "border-red-500" : ""}
								onChange={(e) =>
									setData("password_confirmation", e.target.value)
								}
							/>
							{errors.password_confirmation && (
								<p className="text-xs text-red-500 font-medium">
									{errors.password_confirmation}
								</p>
							)}
						</div>
					</CardContent>

					<CardFooter className="pt-2">
						<Button className="w-full" type="submit" disabled={processing}>
							{processing ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Đang lưu...
								</>
							) : (
								"Cập nhật mật khẩu"
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
