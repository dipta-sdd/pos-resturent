<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->role->can_manage_users;
    }

    public function view(User $user, Role $role)
    {
        return $user->role->can_manage_users;
    }

    public function create(User $user)
    {
        return $user->role->can_manage_users;
    }

    public function update(User $user, Role $role)
    {
        return $user->role->can_manage_users && !$role->is_immutable;
    }

    public function delete(User $user, Role $role)
    {
        return $user->role->can_manage_users && !$role->is_immutable;
    }
}
