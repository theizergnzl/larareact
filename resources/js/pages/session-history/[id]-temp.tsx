import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Monitor, Shield, Navigation, ExternalLink } from "lucide-react";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SessionHistoryDetail {
    id: number;
    action: string;
    action_name: string;
    ip_address: string | null;
    latitude: number | null;
    longitude: number | null;
    location: string | null;
    user_agent: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface PageProps {
    history: SessionHistoryDetail;
}

export default function SessionHistoryDetail({ history }: PageProps) {
    const hasLocation = history.latitude !== null && history.longitude !== null;

    return (
        <AuthenticatedLayout>
            <Head title={`Detalle de Sesión - ${history.action_name}`} />

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route("session-history.index")}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Detalle de Sesión</h1>
                        <p className="text-sm text-muted-foreground">
                            Información completa del acceso al sistema
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Información de la Sesión
                            </CardTitle>
                            <CardDescription>
                                Detalles del evento de acceso
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Tipo de Acción</span>
                                <Badge variant={history.action === "login" ? "default" : "secondary"}>
                                    {history.action_name}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Fecha y Hora</span>
                                <span className="text-sm font-medium">
                                    {format(new Date(history.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Usuario</span>
                                <span className="text-sm font-medium">{history.user.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Email</span>
                                <span className="text-sm font-medium">{history.user.email}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-5 w-5" />
                                Información del Dispositivo
                            </CardTitle>
                            <CardDescription>
                                Datos del navegador y conexión
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Dirección IP</span>
                                <span className="text-sm font-medium">{history.ip_address || "-"}</span>
                            </div>
                            <div className="flex items-start justify-between">
                                <span className="text-sm text-muted-foreground">User Agent</span>
                                <span className="text-sm font-medium max-w-xs truncate">
                                    {history.user_agent || "-"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {hasLocation && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Ubicación Geográfica
                            </CardTitle>
                            <CardDescription>
                                Coordenadas de la ubicación de acceso
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <Navigation className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Latitud</p>
                                        <p className="text-sm font-medium">{history.latitude}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Navigation className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Longitud</p>
                                        <p className="text-sm font-medium">{history.longitude}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center p-6 border rounded-lg">
                                <a
                                    href={`https://www.openstreetmap.org/?mlat=${history.latitude}&mlon=${history.longitude}&zoom=15`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Ver ubicación en OpenStreetMap
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!hasLocation && (
                    <Card>
                        <CardContent className="py-12">
                            <div className="flex flex-col items-center justify-center text-center space-y-2">
                                <MapPin className="h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    No se registró la ubicación para esta sesión
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
