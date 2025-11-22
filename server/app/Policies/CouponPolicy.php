<?php

namespace App\Policies;

use App\Models\Coupon;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CouponPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->role->can_manage_settings;
    }

    public function view(User $user, Coupon $coupon)
    {
        return $user->role->can_manage_settings;
    }

    public function create(User $user)
    {
        return $user->role->can_manage_settings;
    }

    public function update(User $user, Coupon $coupon)
    {
        return $user->role->can_manage_settings;
    }

    public function delete(User $user, Coupon $coupon)
    {
        return $user->role->can_manage_settings;
    }
}
