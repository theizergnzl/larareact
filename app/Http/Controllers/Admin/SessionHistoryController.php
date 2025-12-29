<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SessionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SessionHistoryController extends Controller
{
    /**
     * Obtiene el historial general de sesiones de todos los usuarios
     */
    public function index(Request $request)
    {
        $query = SessionHistory::with('user')
            ->orderBy('created_at', 'desc');

        // Obtener el número de registros por página, por defecto 20
        $perPage = $request->input('per_page', 5);
        // Validar que sea uno de los valores permitidos
        if (!in_array($perPage, [5 ,10, 20, 50, 100])) {
            $perPage = 5;
        }

        // Filtros
        if ($request->has('action') && in_array($request->action, ['login', 'logout'])) {
            $query->where('action', $request->action);
        }

        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->whereHas('user', function ($query) use ($searchTerm) {
                $query->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->where('created_at', '<=', $request->date_to . ' 23:59:59');
        }

        $histories = $query->paginate($perPage);

        // Estadísticas
        $stats = [
            'total_sessions' => SessionHistory::count(),
            'total_logins' => SessionHistory::where('action', 'login')->count(),
            'total_logouts' => SessionHistory::where('action', 'logout')->count(),
            'unique_users' => SessionHistory::distinct('user_id')->count('user_id'),
            'today_sessions' => SessionHistory::whereDate('created_at', today())->count(),
        ];

        return inertia('admin/session-history/index', [
            'histories' => $histories,
            'stats' => $stats,
            'filters' => $request->only(['action', 'search', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Muestra los detalles de una sesión específica
     */
    public function show($id)
    {
        $history = SessionHistory::with('user')
            ->where('id', $id)
            ->firstOrFail();

        return inertia('admin/session-history/[id]', [
            'history' => $history,
        ]);
    }

    /**
     * Obtiene estadísticas detalladas del historial de sesiones
     */
    public function stats()
    {
        $stats = [
            'total_sessions' => SessionHistory::count(),
            'total_logins' => SessionHistory::where('action', 'login')->count(),
            'total_logouts' => SessionHistory::where('action', 'logout')->count(),
            'unique_users' => SessionHistory::distinct('user_id')->count('user_id'),
            'today_sessions' => SessionHistory::whereDate('created_at', today())->count(),
            'today_logins' => SessionHistory::whereDate('created_at', today())->where('action', 'login')->count(),
            'today_logouts' => SessionHistory::whereDate('created_at', today())->where('action', 'logout')->count(),
            'last_7_days' => SessionHistory::where('created_at', '>=', now()->subDays(7))->count(),
            'last_30_days' => SessionHistory::where('created_at', '>=', now()->subDays(30))->count(),
        ];

        // Sesiones por usuario
        $sessionsByUser = SessionHistory::select('user_id', DB::raw('count(*) as total'))
            ->with('user:id,name,email')
            ->groupBy('user_id')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        // Sesiones por día (últimos 7 días)
        $sessionsByDay = SessionHistory::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as total'),
                DB::raw('SUM(CASE WHEN action = "login" THEN 1 ELSE 0 END) as logins'),
                DB::raw('SUM(CASE WHEN action = "logout" THEN 1 ELSE 0 END) as logouts')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'stats' => $stats,
            'sessions_by_user' => $sessionsByUser,
            'sessions_by_day' => $sessionsByDay,
        ]);
    }
}
