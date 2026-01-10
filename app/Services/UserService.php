<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Http\UploadedFile;

class UserService
{
    protected FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    /**
     * Obtener todos los usuarios con filtros y paginación
     */
    public function getAllUsers(array $filters = [], int $perPage = 10)
    {
        $query = User::with('roles');

        // Aplicar filtro de búsqueda
        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Aplicar filtro de estado
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    /**
     * Obtener estadísticas de usuarios
     */
    public function getUserStatistics(): array
    {
        return [
            'total' => User::count(),
            'active' => User::where('status', 'active')->count(),
            'inactive' => User::where('status', 'inactive')->count(),
            'suspended' => User::where('status', 'suspended')->count(),
            'locked' => User::whereNotNull('locked_until')
                          ->where('locked_until', '>', now())
                          ->count(),
        ];
    }

    /**
     * Crear un nuevo usuario
     */
    public function createUser(array $data, ?UploadedFile $avatar = null): User
    {
        return DB::transaction(function () use ($data, $avatar) {
            $user = User::create([
                'name' => $data['name'],
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'status' => $data['status'] ?? 'active',
            ]);

            // Manejar el avatar si se proporciona
            if ($avatar) {
                $avatarName = $this->fileService->storeUserAvatar($avatar, $user->id);
                $user->update(['avatar' => $avatarName]);
            }

            // Asignar rol si se proporciona
            if (isset($data['role'])) {
                $user->assignRole($data['role']);
            }

            // Enviar notificación de verificación de email
            $user->sendEmailVerificationNotification();

            return $user;
        });
    }

    /**
     * Actualizar un usuario existente
     */
    public function updateUser(User $user, array $data, ?UploadedFile $avatar = null): User
    {
        return DB::transaction(function () use ($user, $data, $avatar) {
            // Manejar el password si se proporciona
            if (isset($data['password']) && !empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            // Manejar el cambio de email
            if (isset($data['email']) && $data['email'] !== $user->email) {
                $data['email_verified_at'] = null;
            }

            // Manejar el avatar si se proporciona
            if ($avatar) {
                // Eliminar el avatar anterior si existe
                if ($user->avatar) {
                    $this->fileService->deleteUserAvatar($user->avatar);
                }
                $avatarName = $this->fileService->storeUserAvatar($avatar, $user->id);
                $data['avatar'] = $avatarName;
            }

            $user->update($data);

            // Actualizar rol si se proporciona
            if (isset($data['role'])) {
                $user->syncRoles([$data['role']]);
            }

            return $user->fresh();
        });
    }

    /**
     * Eliminar un usuario
     */
    public function deleteUser(User $user): bool
    {
        return DB::transaction(function () use ($user) {
            // Eliminar el avatar si existe
            if ($user->avatar) {
                $this->fileService->deleteUserAvatar($user->avatar);
            }

            return $user->delete();
        });
    }

    /**
     * Eliminar múltiples usuarios
     */
    public function bulkDeleteUsers(array $userIds): int
    {
        return DB::transaction(function () use ($userIds) {
            $users = User::whereIn('id', $userIds)->get();

            // Eliminar los avatares de los usuarios
            foreach ($users as $user) {
                if ($user->avatar) {
                    $this->fileService->deleteUserAvatar($user->avatar);
                }
            }

            return User::whereIn('id', $userIds)->delete();
        });
    }

    /**
     * Desbloquear un usuario
     */
    public function unlockUser(User $user): void
    {
        $user->unlockAccount();
    }

    /**
     * Bloquear un usuario manualmente
     */
    public function lockUser(User $user, int $minutes = 30): void
    {
        $user->update([
            'locked_until' => now()->addMinutes($minutes),
            'status' => 'suspended',
        ]);
    }

    /**
     * Obtener todos los roles disponibles
     */
    public function getAllRoles(): \Illuminate\Database\Eloquent\Collection
    {
        return Role::all();
    }
}
