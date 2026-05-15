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
      isLogin !== revert ? "Login Efficia Note" : "Sign Up Efficia Note";
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-violet-200 via-indigo-100 to-cyan-100 px-4">
      {/* Background blur */}
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-300/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

      <AlertDialog open>
        <AlertDialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          asChild
          className="border-none bg-transparent shadow-none"
        >
          <Card
            className={`w-full border border-white/40 bg-white/60 shadow-2xl backdrop-blur-xl transition-all ${
              isLogin ? "max-w-sm" : "max-w-[340px]"
            }`}
          >
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-cyan-300 shadow-lg">
                  <span className="text-2xl">✨</span>
                </div>
              </div>

              <div className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {AuthenticationType()}
                </CardTitle>

                <CardDescription className="text-slate-500">
                  {isLogin
                    ? "Welcome back to your account"
                    : "Create your new account"}
                </CardDescription>
              </div>

              <CardAction className="mx-auto">
                <Button
                  variant="ghost"
                  className="rounded-full text-slate-600 hover:bg-violet-100 hover:text-violet-700"
                  onClick={() => toggleIsLogin(!isLogin)}
                >
                  {AuthenticationType(true)}
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <form onSubmit={submit} id={formId}>
                <div className="flex flex-col gap-3">
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
                        <Label htmlFor="password" className="text-slate-700">
                          Password
                        </Label>

                        <a
                          href="#"
                          className="ml-auto text-sm text-violet-600 transition hover:text-violet-800 hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>

                      <Input
                        id="password"
                        type="password"
                        required
                        value={data.password}
                        aria-invalid={errors.password !== undefined}
                        onChange={(e) => setData("password", e.target.value)}
                        className="border-white/50 bg-white/70 text-slate-800 shadow-sm transition focus-visible:ring-violet-300"
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

            <CardFooter className="flex-col gap-2 pt-2">
              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-400 to-cyan-300 text-white shadow-lg transition hover:scale-[1.02] hover:from-violet-500 hover:to-cyan-400"
                disabled={processing}
                form={formId}
              >
                {AuthenticationType()}
              </Button>

              {Object.values(errors).some((error) => error) && isLogin && (
                <Alert className="mt-2 border-red-200 bg-red-50 text-red-700">
                  <AlertCircleIcon />
                  <AlertTitle>Authentication failed</AlertTitle>
                  <AlertDescription>
                    Invalid email or password. Please try again.
                  </AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </Card>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
