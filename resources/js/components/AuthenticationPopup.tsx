import { SubmitEvent, useId, useState } from "react";
import {
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialog,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { useForm } from "@inertiajs/react";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

export default function AuthenticationPopup() {
  const [isLogin, toggleIsLogin] = useState(true),
    { data, setData, post, errors, processing } = useForm({
      email: "",
      password: "",
      remember: false,
    }),
    submit = (e: SubmitEvent) => {
      e.preventDefault();
      post("/login");
    },
    formId = useId(),
    AuthenticationType = (revert = false) =>
      isLogin !== revert ? "Login" : "Sign Up";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button onClick={() => toggleIsLogin(true)}>Login</Button>
      </AlertDialogTrigger>
      <AlertDialogContent asChild>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{AuthenticationType()} to your account</CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your email below to login to your account"
                : "Fill your infomation below to sign up"}
            </CardDescription>
            <CardAction>
              <Button onClick={() => toggleIsLogin(!isLogin)}>
                {AuthenticationType(true)}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} id={formId}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {isLogin && (
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                  />
                </div>
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
            {Object.values(errors).some((error) => error) && (
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
