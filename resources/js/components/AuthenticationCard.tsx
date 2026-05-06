import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { InputField } from "./custom/InputField";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { SubmitEvent, useId, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogContent } from "./ui/alert-dialog";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardAction,
	CardContent,
	CardFooter,
} from "./ui/card";

export default function AuthenticationCard() {
	const [isLogin, toggleIsLogin] = useState(true),
		{ data, setData, post, errors, processing } = useForm({
			email: "",
			password: "",
			password_confirmation: "",
			remember: false,
			name: "",
		}),
		submit = (e: SubmitEvent) => {
			e.preventDefault();

			post(isLogin ? "/login" : "/register");
		},
		formId = useId(),
		AuthenticationType = (revert = false) =>
			isLogin !== revert ? "Login" : "Sign Up";
	return (
		<AlertDialog open>
			<AlertDialogContent onEscapeKeyDown={(e) => e.preventDefault()} asChild>
				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle>{AuthenticationType()} to your account</CardTitle>
						<CardDescription>
							{isLogin
								? "Enter your email below to login to your account"
								: "Fill your infomation below to sign up"}
						</CardDescription>
						<CardAction>
							<Button variant="link" onClick={() => toggleIsLogin(!isLogin)}>
								{AuthenticationType(true)}
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						<form onSubmit={submit} id={formId}>
							<div className="flex flex-col gap-6">
								{!isLogin && (
									<InputField
										label="Name"
										value={data.name}
										invalid={errors.name != undefined}
										desc={errors.name}
										onChange={(e) => setData("name", e.target.value)}
										required
									/>
								)}
								<InputField
									label="Email"
									type="email"
									value={data.email}
									invalid={errors.email != undefined}
									desc={errors.email}
									onChange={(e) => setData("email", e.target.value)}
									required
								/>
								{!isLogin ? (
									<InputField
										type="password"
										label="Password"
										value={data.password}
										invalid={errors.password != undefined}
										desc={errors.password}
										onChange={(e) => setData("password", e.target.value)}
									/>
								) : (
									<div className="grid gap-2">
										<div className="flex items-center">
											<Label htmlFor="password">Password</Label>
											<a
												href="#"
												className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
											>
												Forgot your password?
											</a>
										</div>
										<Input
											id="password"
											type="password"
											required
											value={data.password}
											aria-invalid={errors.password !== undefined}
											onChange={(e) => setData("password", e.target.value)}
										/>
									</div>
								)}
								{!isLogin && (
									<InputField
										label="Confirm password"
										type="password"
										value={data.password_confirmation}
										onChange={(e) =>
											setData("password_confirmation", e.target.value)
										}
										required
									/>
								)}
							</div>
						</form>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button
							type="submit"
							className="w-full"
							disabled={processing}
							form={formId}
						>
							{AuthenticationType()}
						</Button>
						{Object.values(errors).some((error) => error) && isLogin && (
							<Alert variant="destructive" className="max-w-md">
								<AlertCircleIcon />
								<AlertTitle>Authentication failed</AlertTitle>
								<AlertDescription>
									Invalid email address or password. Please check your
									credentials and try again.
								</AlertDescription>
							</Alert>
						)}
					</CardFooter>
				</Card>
			</AlertDialogContent>
		</AlertDialog>
	);
}
