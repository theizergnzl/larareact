import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
}

interface PageProps {
    histories: {
        data: SessionHistory[];
        current_page: number;
        last_page: number;
    };
}

export default function SessionHistoryIndex({ histories }: PageProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Historial de Sesiones" />

            <div className="container mx-auto py-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Sesiones</CardTitle>
                        <CardDescription>
                            Registro de inicios y cierres de sesión con ubicación geográfica
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Acción</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>IP</TableHead>
                                    <TableHead>Dispositivo</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {histories.data.map((history) => (
                                    <TableRow key={history.id}>
                                        <TableCell>
                                            <Badge variant={history.action === "login" ? "default" : "secondary"}>
                                                {history.action_name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(history.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                                        </TableCell>
                                        <TableCell>{history.ip_address || "-"}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {history.user_agent || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={route("session-history.show", history.id)}>
                                                <Button variant="outline" size="sm">
                                                    Ver Detalles
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
