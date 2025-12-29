<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SessionHistoryController;
use App\Http\Controllers\ReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Rutas del historial de sesiones
    Route::get('/session-history', [SessionHistoryController::class, 'index'])->name('session-history.index');
    Route::get('/session-history/{id}', [SessionHistoryController::class, 'show'])->name('session-history.show');
    Route::post('/session-history', [SessionHistoryController::class, 'store'])->name('session-history.store');

    // Rutas de administración del historial de sesiones
    Route::prefix('admin')->group(function () {
        Route::get('/session-history', [\App\Http\Controllers\Admin\SessionHistoryController::class, 'index'])->name('admin.session-history.index');
        Route::get('/session-history/{id}', [\App\Http\Controllers\Admin\SessionHistoryController::class, 'show'])->name('admin.session-history.show');
        Route::get('/session-history/stats', [\App\Http\Controllers\Admin\SessionHistoryController::class, 'stats'])->name('admin.session-history.stats');
    });

    // Rutas de reportes
    Route::prefix('reports')->group(function () {
        Route::get('/', function () {
            return Inertia::render('reports/index');
        })->name('reports.index');
        Route::get('/session-history/export', [ReportController::class, 'exportSessionHistory'])->name('reports.session-history.export');
    });
});

require __DIR__.'/auth.php';
