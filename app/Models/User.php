<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar',
        'status',
        'failed_login_attempts',
        'locked_until',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'locked_until' => 'datetime',
        ];
    }

    /**
     * Verificar si el usuario es administrador
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Verificar si el usuario no es administrador
     */
    public function isNotAdmin(): bool
    {
        return ! $this->isAdmin();
    }

    /**
     * Incrementar el contador de intentos fallidos de inicio de sesión
     */
    public function incrementFailedAttempts(): void
    {
        $this->increment('failed_login_attempts');

        // Recargar el modelo para obtener el valor actualizado de la base de datos
        $this->refresh();

        // Si se alcanzan 3 intentos fallidos, bloquear la cuenta
        if ($this->failed_login_attempts >= 3) {
            $this->lockAccount();
        }
    }

    /**
     * Reiniciar el contador de intentos fallidos tras un inicio de sesión exitoso
     */
    public function resetFailedAttempts(): void
    {
        $this->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
        ]);
    }

    /**
     * Bloquear la cuenta del usuario
     */
    public function lockAccount(): void
    {
        // Bloquear la cuenta por 30 minutos
        $this->update([
            'locked_until' => Carbon::now()->addMinutes(30),
            'status' => 'suspended',
        ]);
    }

    /**
     * Desbloquear la cuenta del usuario
     */
    public function unlockAccount(): void
    {
        $this->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
            'status' => 'active',
        ]);
    }

    /**
     * Verificar si la cuenta está bloqueada
     */
    public function isLocked(): bool
    {
        // Verificar si hay una fecha de bloqueo y si aún está vigente
        if ($this->locked_until && $this->locked_until->isFuture()) {
            return true;
        }

        // Si el bloqueo ha expirado, desbloquear automáticamente
        if ($this->locked_until) {
            $this->unlockAccount();
        }

        return false;
    }

    /**
     * Obtener el tiempo restante de bloqueo en minutos
     */
    public function getLockTimeRemaining(): int
    {
        if (!$this->locked_until) {
            return 0;
        }

        return max(0, Carbon::now()->diffInMinutes($this->locked_until, false));
    }
}

