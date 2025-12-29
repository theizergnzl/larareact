<?php

namespace App\Http\Controllers;

use App\Models\SessionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SessionHistoryExport;

class ReportController extends Controller
{
    /**
     * Exportar el historial de sesiones a Excel
     */
    public function exportSessionHistory(Request $request)
    {
        $fileName = 'historial_sesiones_' . now()->format('Y-m-d_H-i-s') . '.xlsx';

        return Excel::download(
            new SessionHistoryExport($request),
            $fileName
        );
    }
}
