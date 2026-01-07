<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\User\UserResource;
use Illuminate\Support\Facades\Redirect;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UserCreateRequest;
use Illuminate\Support\Facades\Cache;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10); // Default to 10 if not specified
        $status = $request->input('status');

        $users = User::with('roles')
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $roles = Role::all();

        // Get statistics
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'active')->count();
        $inactiveUsers = User::where('status', 'inactive')->count();
        $suspendedUsers = User::where('status', 'suspended')->count();

        return Inertia::render(
            'Users/Index',
            [
                'users' => UserResource::collection($users),
                'roles' => $roles,
                'filters' => [
                    'search' => $search,
                    'per_page' => $perPage,
                    'status' => $status
                ],
                'statistics' => [
                    'total' => $totalUsers,
                    'active' => $activeUsers,
                    'inactive' => $inactiveUsers,
                    'suspended' => $suspendedUsers
                ]
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserCreateRequest $request)
    {
        // create user
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => $request->status ?? 'active',
        ]);

        // store avatar if provided
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarName = $user->id.'.'.$avatar->getClientOriginalExtension();
            $avatar->storeAs('public/avatars', $avatarName);
            $user->update(['avatar' => $avatarName]);
        }

        // assign role
        $user->assignRole($request->role);

        // send verification email
        $user->sendEmailVerificationNotification();

        return redirect()->route('users.index')->with([
            'message' => 'User ' . $user->name . ' created successfully',
            'type' => 'success'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // return the user with the specified id
        return Inertia::render(
            'Users/Edit',
            [
            'user_data' => new UserResource(User::find($id)),
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, $id) : RedirectResponse
    {
        // get user by id
        $user = User::find($id);

        // update user
        $validatedData = $request->validated();

        // Remove password from validated data if it's empty
        if (empty($validatedData['password'])) {
            unset($validatedData['password']);
        } else {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        // Handle email verification reset if email changed
        if (isset($validatedData['email']) && $validatedData['email'] !== $user->email) {
            $validatedData['email_verified_at'] = null;
        }

        // Update user data
        $user->update($validatedData);

        // Handle role update
        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        return redirect()->route('users.index')->with([
            'message' => 'User updated successfully',
            'type' => 'success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        // get the id parameter from the request
        $id = $request->id;

        User::destroy($id);
        // return json with response
        // redirect to route('users.index'); whit message and render inertia page
        return Redirect::route('users.index', ['message' => 'User deleted successfully']);
    }

    /**
     * Find a user by ID.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function findById($id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'user' => new UserResource($user),
            'roles' => Role::all()
        ]);
    }

    /**
     * Get user data for modal editing.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserForModal($id)
    {
        $user = User::with('roles')->findOrFail($id);
        return response()->json([
            'user' => new UserResource($user),
            'roles' => Role::all()
        ]);
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id'
        ]);

        try {
            User::whereIn('id', $request->ids)->delete();

            return redirect()->back()->with('success', 'Users deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete users');
        }
    }
}
