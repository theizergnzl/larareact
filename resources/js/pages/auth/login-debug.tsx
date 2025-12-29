import { FormEventHandler, useEffect, useState } from "react";
import GuestLayout from "@/layouts/guest-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useGeolocation } from "@/hooks/use-geolocation";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputError } from "@/components/ui/input-error";

export default function Login({
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
        latitude: null as number | null,
        longitude: null as number | null,
    });

    const { getCurrentPosition, loading: locationLoading } = useGeolocation();
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            // Obtener ubicación antes de enviar el formulario
            console.log("Intentando obtener ubicación...");
            const position = await getCurrentPosition();
            console.log("Ubicación obtenida:", position);
            setData("latitude", position.latitude);
            setData("longitude", position.longitude);

            // Enviar el formulario con la ubicación
            post(route("login"), {
                onSuccess: async () => {
                    // Registrar el inicio de sesión con ubicación
                    try {
                        console.log("Registrando sesión con ubicación:", position);
                        await axios.post(route("session-history.store"), {
                            action: "login",
                            latitude: position.latitude,
                            longitude: position.longitude,
                        });
                        console.log("Sesión registrada exitosamente");
                    } catch (error) {
                        console.error("Error al registrar la sesión:", error);
                    }
                },
            });
        } catch (error) {
            console.error("Error al obtener ubicación:", error);
            setLocationError("No se pudo obtener la ubicación. Por favor, permite el acceso a la ubicación para continuar.");
            // Permitir el login sin ubicación si hay error
            post(route("login"), {
                onSuccess: async () => {
                    try {
                        console.log("Registrando sesión sin ubicación");
                        await axios.post(route("session-history.store"), {
                            action: "login",
                        });
                        console.log("Sesión registrada exitosamente (sin ubicación)");
                    } catch (error) {
                        console.error("Error al registrar la sesión:", error);
                    }
                },
            });
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <form onSubmit={submit}>
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600">
                                {status}
                            </div>
                        )}

                        {locationError && (
                            <div className="mb-4 font-medium text-sm text-yellow-600">
                                {locationError}
                            </div>
                        )}

                        {locationLoading && (
                            <div className="mb-4 font-medium text-sm text-blue-600">
                                Obteniendo ubicación...
                            </div>
                        )}

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href={route("password.request")}
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </GuestLayout>
    );
}
