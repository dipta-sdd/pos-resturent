<?php

namespace App\Policies;

use App\Models\StaffShift;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StaffShiftPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\StaffShift  $staffShift
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, StaffShift $staffShift)
    {
        return $user->id === $staffShift->user_id || $user->role->can_manage_finance;
    }
}
