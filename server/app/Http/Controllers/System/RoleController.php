<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\StoreRoleRequest;
use App\Http\Requests\System\UpdateRoleRequest;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;

class RoleController extends Controller
{
    public function index()
    {
        return Role::paginate();
    }

    public function store(StoreRoleRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $role = Role::create($data);
        return response()->json($role, 201);
    }

    public function show(Role $role)
    {
        $this->authorize('view', $role);
        return $role;
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->authorize('update', $role);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $role->update($data);
        return response()->json($role);
    }

    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);
        $role->delete();
        return response()->json(null, 204);
    }
}
