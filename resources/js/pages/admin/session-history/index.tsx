import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Monitor, Shield, Search, Filter, Calendar, Users, Activity, LogIn, LogOut, X } from "lucide-react";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useEffect, useRef } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface SessionHistory {
    id: number;
    action: string;
    action_name: string;
    ip_address: string | null;
    latitude: number | null;
    longitude: number | null;
    location: string | null;
    user_agent: string | null;
    created_at: string;
    user: User;
}

interface Stats {
    total_sessions: number;
    total_logins: number;
    total_logouts: number;
    unique_users: number;
    today_sessions: number;
}

interface PageProps {
    histories: {
        data: SessionHistory[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: Stats;
    filters: {
        action?: string;
        search?: string;
        date_from?: string;
        date_to?: string;
        per_page?: string;
    };
}

export default function AdminSessionHistory({ histories, stats, filters }: PageProps) {
    const [localFilters, setLocalFilters] = useState(filters);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearchChange = (value: string) => {
        setLocalFilters(prev => ({ ...prev, search: value }));

        // Limpiar el timeout anterior si existe
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Establecer un nuevo timeout
        searchTimeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            if (value) {
                params.set("search", value);
            } else {
                params.delete("search");
            }
            params.set("page", "1"); // Resetear a la primera página
            router.get(`/admin/session-history?${params.toString()}`);
        }, 500);
    };

    // Limpiar el timeout al desmontar el componente
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));

        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1"); // Resetear a la primera página
        router.get(`/admin/session-history?${params.toString()}`);
    };

    const handlePerPageChange = (value: string) => {
        setLocalFilters(prev => ({ ...prev, per_page: value }));

        const params = new URLSearchParams(window.location.search);
        params.set("per_page", value);
        params.set("page", "1"); // Resetear a la primera página
        router.get(`/admin/session-history?${params.toString()}`);
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get("/admin/session-history");
    };

    return (
        <AuthenticatedLayout>
            <Head title="Historial de Sesiones - Administración" />

            <div className="container mx-auto py-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Historial de Sesiones - Administración</h1>
                        <p className="text-sm text-muted-foreground">
                            Historial general de sesiones de todos los usuarios
                        </p>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sesiones</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_sessions}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
                            <LogIn className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.total_logins}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Salidas</CardTitle>
                            <LogOut className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.total_logouts}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Usuarios Únicos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.unique_users}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sesiones Hoy</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.today_sessions}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtros
                        </CardTitle>
                        <CardDescription>
                            Filtra el historial de sesiones según diferentes criterios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="search">Buscar Usuario</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Buscar por nombre o email..."
                                        className="pl-10"
                                        value={localFilters.search || ""}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                    />
                                    {localFilters.search && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                                            onClick={() => handleSearchChange("")}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="action">Tipo de Acción</Label>
                                <select
                                    id="action"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={localFilters.action || ""}
                                    onChange={(e) => handleFilterChange("action", e.target.value)}
                                >
                                    <option value="">Todas</option>
                                    <option value="login">Ingreso</option>
                                    <option value="logout">Salida</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_from">Fecha Desde</Label>
                                <Input
                                    id="date_from"
                                    type="date"
                                    value={localFilters.date_from || ""}
                                    onChange={(e) => handleFilterChange("date_from", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_to">Fecha Hasta</Label>
                                <Input
                                    id="date_to"
                                    type="date"
                                    value={localFilters.date_to || ""}
                                    onChange={(e) => handleFilterChange("date_to", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                                <X className="h-4 w-4" />
                                Limpiar Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de historial */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Historial de Sesiones
                        </CardTitle>
                        <CardDescription>
                            Lista de todas las sesiones registradas en el sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Usuario
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Acción
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Fecha y Hora
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            IP
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Ubicación
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {histories.data.map((history) => (
                                        <tr key={history.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                <div>
                                                    <div className="font-medium">{history.user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{history.user.email}</div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={history.action === "login" ? "success" : "danger"}>
                                                    {history.action_name}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {format(new Date(history.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                                            </td>
                                            <td className="p-4 align-middle">{history.ip_address || "-"}</td>
                                            <td className="p-4 align-middle">
                                                {history.latitude && history.longitude ? (
                                                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                                        <MapPin className="h-3 w-3" />
                                                        Con ubicación
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">Sin ubicación</span>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Link href={route("admin.session-history.show", history.id)}>
                                                    <Button variant="ghost" size="sm">
                                                        Ver Detalles
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {histories.data.length} de {histories.total} registros
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="per_page">Registros por página:</Label>
                                    <select
                                        id="per_page"
                                        className="flex h-8 w-auto rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                                        value={localFilters.per_page || "5"}
                                        onChange={(e) => handlePerPageChange(e.target.value)}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {histories.current_page > 1 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const params = new URLSearchParams(window.location.search);
                                            params.set("page", (histories.current_page - 1).toString());
                                            router.get(`/admin/session-history?${params.toString()}`);
                                        }}
                                    >
                                        Anterior
                                    </Button>
                                )}
                                <span className="flex items-center px-3 text-sm">
                                    Página {histories.current_page} de {histories.last_page}
                                </span>
                                {histories.current_page < histories.last_page && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const params = new URLSearchParams(window.location.search);
                                            params.set("page", (histories.current_page + 1).toString());
                                            router.get(`/admin/session-history?${params.toString()}`);
                                        }}
                                    >
                                        Siguiente
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
