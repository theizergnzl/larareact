<?php

namespace App\Exports;

use App\Models\SessionHistory;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Illuminate\Http\Request;

class SessionHistoryExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Obtener los datos a exportar
     */
    public function collection()
    {
        $query = SessionHistory::with('user')
            ->orderBy('created_at', 'desc');

        // Aplicar los mismos filtros que en el controlador de administración
        if ($this->request->has('action') && in_array($this->request->action, ['login', 'logout'])) {
            $query->where('action', $this->request->action);
        }

        if ($this->request->has('search') && $this->request->search) {
            $searchTerm = $this->request->search;
            $query->whereHas('user', function ($query) use ($searchTerm) {
                $query->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        if ($this->request->has('date_from') && $this->request->date_from) {
            $query->where('created_at', '>=', $this->request->date_from);
        }

        if ($this->request->has('date_to') && $this->request->date_to) {
            $query->where('created_at', '<=', $this->request->date_to . ' 23:59:59');
        }

        return $query->get();
    }

    /**
     * Definir los encabezados del Excel
     */
    public function headings(): array
    {
        return [
            'ID',
            'Usuario',
            'Email',
            'Acción',
            'Dirección IP',
            'Ubicación',
            'User Agent',
            'Fecha y Hora',
        ];
    }

    /**
     * Mapear los datos para el Excel
     */
    public function map($session): array
    {
        return [
            $session->id,
            $session->user->name,
            $session->user->email,
            $session->action_name,
            $session->ip_address ?? 'N/A',
            $session->location ?? 'N/A',
            $session->user_agent ?? 'N/A',
            $session->created_at->format('d/m/Y H:i:s'),
        ];
    }

    /**
     * Estilos para el Excel
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Estilo para la fila de encabezados
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4F46E5'],
                ],
                'font' => [
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
            // Autoajustar el ancho de las columnas
            'A' => ['width' => 10],
            'B' => ['width' => 25],
            'C' => ['width' => 30],
            'D' => ['width' => 15],
            'E' => ['width' => 15],
            'F' => ['width' => 30],
            'G' => ['width' => 40],
            'H' => ['width' => 20],
        ];
    }
}
