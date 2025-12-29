<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'ip_address',
        'latitude',
        'longitude',
        'user_agent',
    ];

    /**
     * Relación con el usuario
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtiene el nombre de la acción en español
     */
    public function getActionNameAttribute(): string
    {
        return match($this->action) {
            'login' => 'Inicio de sesión',
            'logout' => 'Cierre de sesión',
            default => 'Desconocido',
        };
    }

    /**
     * Obtiene la ubicación formateada
     */
    public function getLocationAttribute(): ?string
    {
        if ($this->latitude && $this->longitude) {
            return "{$this->latitude}, {$this->longitude}";
        }
        return null;
    }
}
