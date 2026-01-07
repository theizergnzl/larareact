<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
        'id' => $this->id,
        'name' => $this->name,
        'username' => $this->username,
        'email' => $this->email,
        'status' => $this->status,
        'roles' => $this->whenLoaded('roles', function () {
            return $this->roles->pluck('name');
        }),
        'avatar' => $this->avatar ? asset('storage/avatars/'.$this->avatar) : null,
        'created_at' => $this->created_at->format('d F Y'),
        'updated_at' => $this->updated_at->format('d F Y'),
        'permissions' => $this->whenLoaded('permissions', function () {
            return $this->permissions->pluck('name');
        }),
         ];
    }
}
