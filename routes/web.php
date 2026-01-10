<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', 'dashboard');

Route::group(['middleware' => ['auth:sanctum']], function () {

        // DASHBOARD
        Route::get('dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');

        // PROFILE
        Route::get('/profile', array( ProfileController::class, 'edit' ))->name('profile.edit');
        Route::patch('/profile', array( ProfileController::class, 'update' ))->name('profile.update');
        Route::delete('/profile', array( ProfileController::class, 'destroy' ))->name('profile.destroy');
        Route::post('profile/avatar', [ProfileController::class, 'updateAvatar'])
            ->name('profile.avatar.update');
        // USERS

        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{id}', [UserController::class, 'findById'])->name('users.show');
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::patch('/users/{id}', [UserController::class, 'update'])->name('users.update');
        Route::get('/users/{id}/modal', [UserController::class, 'getUserForModal'])->name('users.modal');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::delete('/users/bulk-destroy', [UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
        Route::post('/users/{id}/unlock', [UserController::class, 'unlock'])->name('users.unlock');
});

require __DIR__ . '/auth.php';
