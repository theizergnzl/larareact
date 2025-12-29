<?php

namespace App\Http\Controllers;

use App\Models\SessionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SessionHistoryController extends Controller
{
    /**
     * Obtiene el historial de sesiones del usuario autenticado
     */
    public function index()
    {
        $histories = Auth::user()
            ->sessionHistories()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return inertia('session-history/index', [
            'histories' => $histories,
        ]);
    }

    /**
     * Muestra los detalles de una sesión específica
     */
    public function show($id)
    {
        $history = SessionHistory::with('user')
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return inertia('session-history/[id]', [
            'history' => $history,
        ]);
    }

    /**
     * Registra una acción de sesión
     */
    public function store(Request $request)
    {
        // Registrar todos los datos recibidos para depuración
        \Log::info('Datos recibidos en session-history.store:', [
            'all' => $request->all(),
            'action' => $request->input('action'),
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
        ]);

        $validated = $request->validate([
            'action' => 'required|in:login,logout',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $sessionHistory = SessionHistory::create([
            'user_id' => Auth::id(),
            'action' => $request->input('action'),
            'ip_address' => $request->ip(),
            'latitude' => $request->input('latitude') ?? null,
            'longitude' => $request->input('longitude') ?? null,
            'user_agent' => $request->userAgent(),
        ]);

        \Log::info('SessionHistory creado:', $sessionHistory->toArray());

        return response()->json(['message' => 'Sesión registrada correctamente']);
    }
}
