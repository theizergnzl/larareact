import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download } from "lucide-react";

export default function ReportsIndex() {
    return (
        <AuthenticatedLayout header="Reportes">
            <Head title="Reportes" />

            <div className="container mx-auto py-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Reportes</h1>
                    <p className="text-sm text-muted-foreground">
                        Genera y descarga reportes del sistema
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                <CardTitle>Historial de Sesiones</CardTitle>
                            </div>
                            <CardDescription>
                                Exporta el historial de sesiones en formato Excel
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => window.location.href = route("reports.session-history.export")}
                                className="w-full"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Exportar a Excel
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
