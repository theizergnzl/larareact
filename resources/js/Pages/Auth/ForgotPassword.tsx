import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Mail } from "lucide-react";

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.email"));
  };

  return (
    <GuestLayout>
      <Head title="Olvidé mi Contraseña" />

      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl shadow-primary/20 dark:shadow-primary/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
          <CardHeader className="space-y-3 pb-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">¿Olvidaste tu contraseña?</CardTitle>
            <CardDescription className="text-center text-base">
              No hay problema. Solo ingresa tu correo electrónico y te enviaremos
              un enlace para restablecer tu contraseña.
            </CardDescription>
          </CardHeader>
          {status && (
            <div className="px-8 mb-4 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800">
              {status}
            </div>
          )}

          <form onSubmit={submit}>
            <CardContent className="space-y-6 px-8 pb-8">
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
                    placeholder="Ingresa tu correo electrónico"
                    onChange={(e) => setData("email", e.target.value)}
                  />
                </div>
                <InputError message={errors.email} className="mt-2" />
              </div>
            </CardContent>
          </form>
          <CardFooter className="px-8 py-6 bg-muted/30 border-t">
            <div className="flex w-full gap-3">
              <Button
                className="flex-1"
                variant={"outline"}
                onClick={() => {
                  history.back();
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={submit}
                disabled={processing}
              >
                {processing ? "Enviando..." : "Enviar Enlace"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </GuestLayout>
  );
}
