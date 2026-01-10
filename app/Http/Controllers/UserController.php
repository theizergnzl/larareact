<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\User\UserResource;
use Illuminate\Support\Facades\Redirect;
use App\Services\UserService;
use App\Repositories\UserRepositoryInterface;
use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    protected UserService $userService;
    protected UserRepositoryInterface $userRepository;

    public function __construct(
        UserService $userService,
        UserRepositoryInterface $userRepository
    ) {
        $this->userService = $userService;
        $this->userRepository = $userRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'per_page' => $request->input('per_page', 10),
        ];

        $users = $this->userService->getAllUsers($filters, $filters['per_page']);
        $roles = $this->userService->getAllRoles();
        $statistics = $this->userService->getUserStatistics();

        return Inertia::render(
            'Users/Index',
            [
                'users' => UserResource::collection($users),
                'roles' => $roles,
                'filters' => $filters,
                'statistics' => $statistics
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => $this->userService->getAllRoles(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserCreateRequest $request)
    {
        $data = $request->validated();
        $avatar = $request->hasFile('avatar') ? $request->file('avatar') : null;

        $user = $this->userService->createUser($data, $avatar);

        return redirect()->route('users.index')->with([
            'message' => 'Usuario ' . $user->name . ' creado exitosamente',
            'type' => 'success'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = $this->userRepository->find($id);

        return Inertia::render('Users/Show', [
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = $this->userRepository->find($id);

        return Inertia::render('Users/Edit', [
            'user_data' => new UserResource($user),
            'roles' => $this->userService->getAllRoles(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, $id): RedirectResponse
    {
        $user = $this->userRepository->find($id);
        $data = $request->validated();
        $avatar = $request->hasFile('avatar') ? $request->file('avatar') : null;

        $this->userService->updateUser($user, $data, $avatar);

        return redirect()->route('users.index')->with([
            'message' => 'Usuario actualizado exitosamente',
            'type' => 'success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $user = $this->userRepository->find($request->id);
        $this->userService->deleteUser($user);

        return Redirect::route('users.index', [
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }

    /**
     * Find a user by ID.
     */
    public function findById($id)
    {
        $user = $this->userRepository->find($id);

        return response()->json([
            'user' => new UserResource($user),
            'roles' => $this->userService->getAllRoles()
        ]);
    }

    /**
     * Get user data for modal editing.
     */
    public function getUserForModal($id)
    {
        $user = $this->userRepository->find($id);

        return response()->json([
            'user' => new UserResource($user),
            'roles' => $this->userService->getAllRoles()
        ]);
    }

    /**
     * Bulk delete users.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id'
        ]);

        try {
            $this->userService->bulkDeleteUsers($request->ids);

            return redirect()->back()->with('success', 'Usuarios eliminados exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al eliminar usuarios');
        }
    }

    /**
     * Unlock a user account.
     */
    public function unlock($id)
    {
        $user = $this->userRepository->find($id);
        $this->userService->unlockUser($user);

        return redirect()->back()->with('success', 'Usuario desbloqueado exitosamente');
    }
}
