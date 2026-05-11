import { FormEvent } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function ForgotPassword({ status }: { status?: string }) {
	const { data, setData, post, processing, errors } = useForm({
		email: "",
	});

	const submit = (e: FormEvent) => {
		e.preventDefault();
		post(route("password.email"));
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
			<Head title="Quên mật khẩu" />

			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold tracking-tight text-center">
						Quên mật khẩu?
					</CardTitle>
					<CardDescription className="text-center">
						Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu
						mới.
					</CardDescription>
				</CardHeader>

				<form onSubmit={submit}>
					<CardContent className="space-y-4">
						{/* Hiển thị thông báo thành công từ Laravel session */}
						{status && (
							<Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
								<MailCheck className="h-4 w-4 stroke-emerald-600" />
								<AlertDescription>{status}</AlertDescription>
							</Alert>
						)}

						<div className="grid gap-2">
							<Label htmlFor="email">Địa chỉ Email</Label>
							<Input
								id="email"
								type="email"
								name="email"
								value={data.email}
								placeholder="name@example.com"
								className={errors.email ? "border-red-500" : ""}
								onChange={(e) => setData("email", e.target.value)}
								autoFocus
							/>
							{errors.email && (
								<p className="text-xs text-red-500 font-medium">
									{errors.email}
								</p>
							)}
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4 pt-2">
						<Button className="w-full" type="submit" disabled={processing}>
							{processing ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Đang xử lý...
								</>
							) : (
								"Gửi liên kết khôi phục"
							)}
						</Button>

						<Link
							href={route("index")}
							className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Quay lại trang đăng nhập
						</Link>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
