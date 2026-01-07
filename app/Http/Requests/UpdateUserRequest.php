<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // get id from request
        $id = $this->route()->parameter('id');
        return [
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,'.$id,
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore((int)$id)],
            'password' => 'nullable|min:8',
            'status' => 'sometimes|in:active,inactive,suspended',
            'role' => 'sometimes|string|exists:roles,name',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }
}
