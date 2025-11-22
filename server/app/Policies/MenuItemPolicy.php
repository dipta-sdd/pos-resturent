<?php

namespace App\Policies;

use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MenuItemPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->role->can_manage_menu;
    }

    public function view(User $user, MenuItem $menuItem)
    {
        return $user->role->can_manage_menu;
    }

    public function create(User $user)
    {
        return $user->role->can_manage_menu;
    }

    public function update(User $user, MenuItem $menuItem)
    {
        return $user->role->can_manage_menu;
    }

    public function delete(User $user, MenuItem $menuItem)
    {
        return $user->role->can_manage_menu;
    }
}
