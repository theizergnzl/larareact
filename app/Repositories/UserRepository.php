<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;

class UserRepository implements UserRepositoryInterface
{
    /**
     * Obtener todos los usuarios
     */
    public function all(): Collection
    {
        return User::with('roles')->get();
    }

    /**
     * Obtener un usuario por su ID
     */
    public function find(int $id): ?User
    {
        return User::with('roles')->find($id);
    }

    /**
     * Obtener un usuario por su email
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    /**
     * Obtener un usuario por su username
     */
    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)->first();
    }

    /**
     * Crear un nuevo usuario
     */
    public function create(array $data): User
    {
        return User::create($data);
    }

    /**
     * Actualizar un usuario existente
     */
    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh();
    }

    /**
     * Eliminar un usuario
     */
    public function delete(User $user): bool
    {
        return $user->delete();
    }

    /**
     * Obtener usuarios con paginación
     */
    public function paginate(int $perPage = 10)
    {
        return User::with('roles')->latest()->paginate($perPage);
    }

    /**
     * Buscar usuarios por criterios
     */
    public function search(array $criteria)
    {
        $query = User::with('roles');

        // Filtro de búsqueda
        if (isset($criteria['search'])) {
            $search = $criteria['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtro de estado
        if (isset($criteria['status'])) {
            $query->where('status', $criteria['status']);
        }

        // Paginación
        $perPage = $criteria['per_page'] ?? 10;
        return $query->latest()->paginate($perPage)->withQueryString();
    }

    /**
     * Contar usuarios por estado
     */
    public function countByStatus(string $status): int
    {
        return User::where('status', $status)->count();
    }

    /**
     * Obtener usuarios bloqueados
     */
    public function getLockedUsers(): Collection
    {
        return User::whereNotNull('locked_until')
                   ->where('locked_until', '>', now())
                   ->get();
    }
}
