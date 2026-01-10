<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Exception;

class FileService
{
    /**
     * Almacenar un archivo en el sistema de almacenamiento
     *
     * @param UploadedFile $file
     * @param string $path
     * @param string|null $name
     * @return string
     * @throws Exception
     */
    public function storeFile(UploadedFile $file, string $path, ?string $name = null): string
    {
        try {
            $fileName = $name ?? uniqid() . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs($path, $fileName);

            return basename($filePath);
        } catch (Exception $e) {
            throw new Exception('Error al almacenar el archivo: ' . $e->getMessage());
        }
    }

    /**
     * Eliminar un archivo del sistema de almacenamiento
     *
     * @param string $path
     * @param string $fileName
     * @return bool
     */
    public function deleteFile(string $path, string $fileName): bool
    {
        try {
            return Storage::delete($path . '/' . $fileName);
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Almacenar un avatar de usuario
     *
     * @param UploadedFile $file
     * @param int $userId
     * @return string
     * @throws Exception
     */
    public function storeUserAvatar(UploadedFile $file, int $userId): string
    {
        $fileName = $userId . '.' . $file->getClientOriginalExtension();
        return $this->storeFile($file, 'public/avatars', $fileName);
    }

    /**
     * Eliminar el avatar de un usuario
     *
     * @param string $avatarName
     * @return bool
     */
    public function deleteUserAvatar(string $avatarName): bool
    {
        return $this->deleteFile('public/avatars', $avatarName);
    }

    /**
     * Obtener la URL pública de un archivo
     *
     * @param string $path
     * @param string $fileName
     * @return string|null
     */
    public function getFileUrl(string $path, string $fileName): ?string
    {
        try {
            return Storage::url($path . '/' . $fileName);
        } catch (Exception $e) {
            return null;
        }
    }
}
