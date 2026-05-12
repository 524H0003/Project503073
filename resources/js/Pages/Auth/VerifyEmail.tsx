import { useForm, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { route } from "ziggy-js";

export default function VerifyEmail({ status }: { status?: string }) {
	const { post, processing } = useForm({});

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route("verification.send"));
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50">
			<Head title="Xác thực Email" />
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Xác thực tài khoản</CardTitle>
					<CardDescription>
						Cảm ơn bạn đã đăng ký! Trước khi bắt đầu, bạn có thể xác nhận địa
						chỉ email của mình bằng cách nhấp vào liên kết chúng tôi vừa gửi cho
						bạn không?
					</CardDescription>
				</CardHeader>
				<CardContent>
					{status === "verification-link-sent" && (
						<div className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded border border-green-200">
							Một liên kết xác thực mới đã được gửi đến địa chỉ email bạn đã
							cung cấp lúc đăng ký.
						</div>
					)}
				</CardContent>
				<CardFooter className="flex items-center justify-between">
					<form onSubmit={submit}>
						<Button disabled={processing}>Gửi lại email xác thực</Button>
					</form>
					<Button variant="ghost" asChild>
						<a href={route("logout")} data-method="post">
							Đăng xuất
						</a>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
