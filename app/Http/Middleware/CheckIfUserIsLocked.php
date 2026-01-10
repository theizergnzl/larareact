<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckIfUserIsLocked
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user->isLocked()) {
            Auth::logout();

            return redirect()->route('login')->with([
                'error' => 'Su cuenta ha sido bloqueada temporalmente. Por favor, contacte al administrador.',
            ]);
        }

        return $next($request);
    }
}
