import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Monitor, Shield, Navigation, Map as MapIcon } from "lucide-react";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
    latitude: number;
    longitude: number;
    actionName: string;
    createdAt: string;
    onAddressLoad: (address: Address) => void;
}

function SessionMap({ latitude, longitude, actionName, createdAt, onAddressLoad }: MapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const addressFetchedRef = useRef(false);
    const markerRef = useRef<L.Marker | null>(null);
    const addressRef = useRef<string | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapRef.current) {
            // Crear el mapa
            mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], 15);

            // Agregar capa de OpenStreetMap
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);

            // Crear icono personalizado
            const customIcon = L.icon({
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            });

            // Agregar marcador
            markerRef.current = L.marker([latitude, longitude], { icon: customIcon })
                .addTo(mapRef.current)
                .bindPopup(
                    `<div class="text-sm">
                        <p class="font-semibold">${actionName}</p>
                        <p class="text-muted-foreground">${format(new Date(createdAt), "dd/MM/yyyy HH:mm:ss", { locale: es })}</p>
                        <p class="mt-2 text-xs text-muted-foreground">Cargando dirección...</p>
                    </div>`
                )
                .openPopup();

            // Obtener dirección usando Nominatim (solo una vez)
            if (!addressFetchedRef.current) {
                addressFetchedRef.current = true;
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
                    .then(response => response.json())
                    .then((data: Address) => {
                        addressRef.current = data.display_name;
                        onAddressLoad(data);
                        // Actualizar el popup del marcador con la dirección
                        if (markerRef.current) {
                            markerRef.current.setPopupContent(
                                `<div class="text-sm">
                                    <p class="font-semibold">${actionName}</p>
                                    <p class="text-muted-foreground">${format(new Date(createdAt), "dd/MM/yyyy HH:mm:ss", { locale: es })}</p>
                                    <p class="mt-2 text-xs text-muted-foreground">${data.display_name}</p>
                                </div>`
                            );
                        }
                    })
                    .catch(error => {
                        console.error("Error al obtener la dirección:", error);
                    });
            }
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                addressFetchedRef.current = false;
                markerRef.current = null;
                addressRef.current = null;
            }
        };
    }, [latitude, longitude]);

    return (
        <div
            ref={mapContainerRef}
            className="h-96 w-full rounded-lg overflow-hidden border"
            style={{ height: "384px" }}
        />
    );
}

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

interface Address {
    display_name: string;
    address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
    };
}

interface PageProps {
    history: SessionHistoryDetail;
}

export default function AdminSessionHistoryDetail({ history }: PageProps) {
    const [address, setAddress] = useState<Address | null>(null);
    const hasLocation = history.latitude !== null && history.longitude !== null;

    const handleAddressLoad = useCallback((addr: Address) => {
        setAddress(addr);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title={`Detalle de Sesión - ${history.action_name} - Administración`} />

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/session-history">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Detalle de Sesión - Administración</h1>
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
                                <Badge variant={history.action === "login" ? "success" : "danger"}>
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
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">ID de Usuario</span>
                                <span className="text-sm font-medium">{history.user.id}</span>
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
                                Coordenadas y mapa de la ubicación de acceso
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

                            <SessionMap
                                latitude={history.latitude!}
                                longitude={history.longitude!}
                                actionName={history.action_name}
                                createdAt={history.created_at}
                                onAddressLoad={handleAddressLoad}
                            />

                            {address && (
                                <div className="mt-4 p-4 bg-muted rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <MapIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium mb-1">Dirección:</p>
                                            <p className="text-sm text-muted-foreground">{address.display_name}</p>
                                            <div className="mt-2 space-y-1">
                                                {address.address.road && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Calle: {address.address.road} {address.address.house_number || ''}
                                                    </p>
                                                )}
                                                {(address.address.city || address.address.town || address.address.village) && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Ciudad: {address.address.city || address.address.town || address.address.village}
                                                    </p>
                                                )}
                                                {address.address.state && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Estado/Provincia: {address.address.state}
                                                    </p>
                                                )}
                                                {address.address.country && (
                                                    <p className="text-xs text-muted-foreground">
                                                        País: {address.address.country}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
