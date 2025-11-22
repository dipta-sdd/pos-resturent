<?php

namespace App\Policies;

use App\Models\DiningTable;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DiningTablePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->role->can_manage_settings;
    }

    public function view(User $user, DiningTable $diningTable)
    {
        return $user->role->can_manage_settings;
    }

    public function create(User $user)
    {
        return $user->role->can_manage_settings;
    }

    public function update(User $user, DiningTable $diningTable)
    {
        return $user->role->can_manage_settings;
    }

    public function delete(User $user, DiningTable $diningTable)
    {
        return $user->role->can_manage_settings;
    }
}
