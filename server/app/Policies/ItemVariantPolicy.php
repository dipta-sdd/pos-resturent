<?php

namespace App\Policies;

use App\Models\ItemVariant;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ItemVariantPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->role->can_manage_menu;
    }

    public function view(User $user, ItemVariant $itemVariant)
    {
        return $user->role->can_manage_menu;
    }

    public function create(User $user)
    {
        return $user->role->can_manage_menu;
    }

    public function update(User $user, ItemVariant $itemVariant)
    {
        return $user->role->can_manage_menu;
    }

    public function delete(User $user, ItemVariant $itemVariant)
    {
        return $user->role->can_manage_menu;
    }
}
