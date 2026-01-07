import { Head, Link, useForm } from "@inertiajs/react";

import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { useEffect, FormEventHandler, useState } from "react";

import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { SocialLogin } from "@/Components/auth/SocialLogin";
import { LoginHeader } from "@/Components/auth/LoginHeader";
import { LoadingSpinner } from "@/Components/auth/LoadingSpinner";

export default function LoginForm({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    post(route("login"), {
      onFinish: () => setIsLoading(false),
    });
  };

  return (
    <GuestLayout>
      <Head title="Login" />
      <div className="relative w-full max-w-md space-y-6">
        <LoginHeader
          title="Welcome back"
          description="Sign in to your account to continue"
        />

        <Card className="border-0 shadow-2xl shadow-primary/10 dark:shadow-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email or Username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="text"
                    name="email"
                    value={data.email}
                    placeholder="Enter your email or username"
                    autoComplete="username"
                    required
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    onChange={(e) => setData("email", e.target.value)}
                  />
                </div>
                <InputError message={errors.email} className="mt-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  {canResetPassword && (
                    <Link
                      href={route("password.request")}
                      className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={data.password}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    autoComplete="current-password"
                    onChange={(e) => setData("password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <InputError message={errors.password} className="mt-1" />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={data.remember}
                  onCheckedChange={(checked) => setData("remember", checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={processing || isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <SocialLogin />
            </div>
          </CardContent>
        </Card>

        {status && (
          <div className="text-center text-sm text-green-600 dark:text-green-400">
            {status}
          </div>
        )}
      </div>
    </GuestLayout>
  );
}
