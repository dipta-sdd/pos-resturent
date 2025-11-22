<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->role->can_view_all_orders;
    }

    public function view(User $user, Order $order)
    {
        return $user->id === $order->user_id || $user->role->can_view_all_orders;
    }

    public function create(User $user)
    {
        return $user->role->can_create_orders;
    }

    public function update(User $user, Order $order)
    {
        return $user->role->can_edit_orders;
    }

    public function delete(User $user, Order $order)
    {
        return $user->role->can_edit_orders;
    }
}
