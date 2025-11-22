<?php

namespace App\Policies;

use App\Models\PayoutRequest;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PayoutRequestPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->role->can_manage_finance;
    }

    public function view(User $user, PayoutRequest $payoutRequest)
    {
        return $user->role->can_manage_finance;
    }

    public function create(User $user)
    {
        return $user->role->can_perform_delivery || $user->role->can_perform_shifts;
    }

    public function update(User $user, PayoutRequest $payoutRequest)
    {
        return $user->role->can_manage_finance;
    }
}
