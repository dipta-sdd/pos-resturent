<?php

namespace App\Policies;

use App\Models\Expense;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExpensePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->role->can_manage_finance;
    }

    public function view(User $user, Expense $expense)
    {
        return $user->role->can_manage_finance;
    }

    public function create(User $user)
    {
        return $user->role->can_manage_finance;
    }

    public function update(User $user, Expense $expense)
    {
        return $user->role->can_manage_finance;
    }

    public function delete(User $user, Expense $expense)
    {
        return $user->role->can_manage_finance;
    }
}
