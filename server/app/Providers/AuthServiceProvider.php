<?php

namespace App\Providers;

use App\Models\Address;
use App\Models\Order;
use App\Models\StaffShift;
use App\Models\User;
use App\Models\Role;
use App\Models\Coupon;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\AddOn;
use App\Policies\AddressPolicy;
use App\Policies\OrderPolicy;
use App\Policies\StaffShiftPolicy;
use App\Policies\UserPolicy;
use App\Policies\RolePolicy;
use App\Policies\CouponPolicy;
use App\Policies\ExpensePolicy;
use App\Policies\ExpenseCategoryPolicy;
use App\Policies\AddOnPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Address::class => AddressPolicy::class,
        Order::class => OrderPolicy::class,
        StaffShift::class => StaffShiftPolicy::class,
        User::class => UserPolicy::class,
        Role::class => RolePolicy::class,
        Coupon::class => CouponPolicy::class,
        Expense::class => ExpensePolicy::class,
        ExpenseCategory::class => ExpenseCategoryPolicy::class,
        AddOn::class => AddOnPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
    }
}
