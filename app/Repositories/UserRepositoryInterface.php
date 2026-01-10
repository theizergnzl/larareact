<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    /**
     * Obtener todos los usuarios
     */
    public function all(): Collection;

    /**
     * Obtener un usuario por su ID
     */
    public function find(int $id): ?User;

    /**
     * Obtener un usuario por su email
     */
    public function findByEmail(string $email): ?User;

    /**
     * Obtener un usuario por su username
     */
    public function findByUsername(string $username): ?User;

    /**
     * Crear un nuevo usuario
     */
    public function create(array $data): User;

    /**
     * Actualizar un usuario existente
     */
    public function update(User $user, array $data): User;

    /**
     * Eliminar un usuario
     */
    public function delete(User $user): bool;

    /**
     * Obtener usuarios con paginación
     */
    public function paginate(int $perPage = 10);

    /**
     * Buscar usuarios por criterios
     */
    public function search(array $criteria);

    /**
     * Contar usuarios por estado
     */
    public function countByStatus(string $status): int;

    /**
     * Obtener usuarios bloqueados
     */
    public function getLockedUsers(): Collection;
}
