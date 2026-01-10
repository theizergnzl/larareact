import { useEffect, FormEventHandler } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Head, useForm } from "@inertiajs/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Mail, Lock } from "lucide-react";

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

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.store"));
  };

  return (
    <GuestLayout>
      <Head title="Restablecer Contraseña" />
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl shadow-primary/20 dark:shadow-primary/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
          <CardHeader className="space-y-3 pb-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Restablecer Contraseña</CardTitle>
            <CardDescription className="text-center text-base">
              Ingresa tu nueva contraseña para restablecerla.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Correo Electrónico
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="pl-11 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    autoComplete="username"
                    placeholder="Ingresa tu correo electrónico"
                    onChange={(e) => setData("email", e.target.value)}
                  />
                </div>
                <InputError message={errors.email} className="mt-2" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Contraseña
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="pl-11 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    autoComplete="new-password"
                    placeholder="Ingresa tu nueva contraseña"
                    onChange={(e) => setData("password", e.target.value)}
                  />
                </div>
                <InputError message={errors.password} className="mt-2" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation" className="text-sm font-semibold">
                  Confirmar Contraseña
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="pl-11 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    autoComplete="new-password"
                    placeholder="Confirma tu nueva contraseña"
                    onChange={(e) =>
                      setData("password_confirmation", e.target.value)
                    }
                  />
                </div>
                <InputError
                  message={errors.password_confirmation}
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                disabled={processing}
              >
                {processing ? "Restableciendo..." : "Restablecer Contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </GuestLayout>
  );
}
