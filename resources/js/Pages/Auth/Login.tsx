import { Head, Link, useForm } from "@inertiajs/react";

import GuestLayout from "@/Layouts/GuestLayout";
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
import { toast } from "sonner";

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
    // Mostrar notificación si hay errores de autenticación
    if (errors.email) {
      const errorMessage = errors.email as string;

      if (errorMessage.includes("bloqueada")) {
        toast.error(errorMessage, {
          duration: 5000,
          position: "top-center",
        });
      } else if (errorMessage.includes("2 intentos")) {
        toast.warning(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
      } else if (errorMessage.includes("no existe")) {
        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
      }
    }

    return () => {
      reset("password");
    };
  }, [errors.email]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    post(route("login"), {
      onFinish: () => setIsLoading(false),
    });
  };

  return (
    <GuestLayout>
      <Head title="Iniciar Sesión" />
      <div className="relative w-full max-w-md space-y-8">


        <Card className="border-0 shadow-2xl shadow-primary/20 dark:shadow-primary/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
          <CardHeader className="space-y-3 pb-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center text-base">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Correo Electrónico o Nombre de Usuario
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="text"
                    name="email"
                    value={data.email}
                    placeholder="Ingresa tu correo o nombre de usuario"
                    autoComplete="username"
                    required
                    className="pl-11 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    onChange={(e) => setData("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Contraseña
                  </Label>
                  {canResetPassword && (
                    <Link
                      href={route("password.request")}
                      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={data.password}
                    placeholder="Ingresa tu contraseña"
                    className="pl-11 pr-11 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    autoComplete="current-password"
                    onChange={(e) => setData("password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors group-focus-within:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="remember"
                  checked={data.remember}
                  onCheckedChange={(checked) => setData("remember", checked as boolean)}
                  className="h-5 w-5"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Recordarme en este dispositivo
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                disabled={processing || isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>

            </div>


          </CardContent>
        </Card>

        {status && (
          <div className="text-center text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800">
            {status}
          </div>
        )}
      </div>
    </GuestLayout>
  );
}
