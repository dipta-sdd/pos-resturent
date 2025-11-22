<?php

namespace App\Policies;

use App\Models\ExpenseCategory;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExpenseCategoryPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->role->can_manage_finance;
    }

    public function view(User $user, ExpenseCategory $expenseCategory)
    {
        return $user->role->can_manage_finance;
    }

    public function create(User $user)
    {
        return $user->role->can_manage_finance;
    }

    public function update(User $user, ExpenseCategory $expenseCategory)
    {
        return $user->role->can_manage_finance;
    }

    public function delete(User $user, ExpenseCategory $expenseCategory)
    {
        return $user->role->can_manage_finance;
    }
}
