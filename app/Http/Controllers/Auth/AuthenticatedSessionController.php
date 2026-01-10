<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Buscar el usuario por email o username
        $user = User::where('email', $request->email)
                     ->orWhere('username', $request->email)
                     ->first();

        // Verificar si el usuario existe y está bloqueado
        if ($user && $user->isLocked()) {
            $minutesRemaining = $user->getLockTimeRemaining();

            return back()
                ->withInput($request->only('email', 'remember'))
                ->withErrors([
                    'email' => "Su cuenta ha sido bloqueada temporalmente debido a múltiples intentos de inicio de sesión fallidos. Por favor, espere {$minutesRemaining} minutos o contacte al administrador.",
                ]);
        }

        // Intentar autenticar al usuario
        if ($user) {
            // Autenticar usando el email del usuario encontrado
            if (Auth::attempt(['email' => $user->email, 'password' => $request->password], $request->boolean('remember'))) {
                // Regenerar la sesión
                $request->session()->regenerate();

                // Reiniciar el contador de intentos fallidos tras un inicio de sesión exitoso
                $user->resetFailedAttempts();

                return redirect()->intended(route('dashboard', absolute: false));
            }

            // La contraseña es incorrecta, incrementar el contador de intentos fallidos
            $user->incrementFailedAttempts();

            // Verificar si el usuario ha sido bloqueado tras este intento fallido
            if ($user->isLocked()) {
                return back()
                    ->withInput($request->only('email', 'remember'))
                    ->withErrors([
                        'email' => "Su cuenta ha sido bloqueada temporalmente debido a múltiples intentos de inicio de sesión fallidos. Por favor, espere 30 minutos o contacte al administrador.",
                    ]);
            }

            // Si tiene 2 intentos fallidos, advertir al usuario
            if ($user->failed_login_attempts >= 2) {
                return back()
                    ->withInput($request->only('email', 'remember'))
                    ->withErrors([
                        'email' => "Ha realizado 2 intentos fallidos. Su cuenta será bloqueada tras el próximo intento fallido.",
                    ]);
            }

            // Mensaje genérico para usuario existente con contraseña incorrecta
            return back()
                ->withInput($request->only('email', 'remember'))
                ->withErrors([
                    'email' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
                ]);
        }

        // El usuario no existe
        return back()
            ->withInput($request->only('email', 'remember'))
            ->withErrors([
                'email' => 'El usuario no existe en nuestro sistema.',
            ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}

