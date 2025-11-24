<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'can_access_dashboard',
        'can_manage_users',
        'can_manage_menu',
        'can_manage_settings',
        'can_create_orders',
        'can_view_all_orders',
        'can_edit_orders',
        'can_update_order_status',
        'can_manage_finance', 
        'can_view_reports',
        'can_perform_delivery',
        'can_perform_shifts',
        'can_manage_shop_settings',
        'can_manage_payment_methods',
        'can_manage_staff',
        'can_manage_roles_and_permissions',
        'can_view_user_activity_log',
        'can_view_products',
        'can_manage_products',
        'can_manage_categories',
        'can_import_products',
        'can_export_products',
        'can_use_pos',
        'can_view_sales_history',
        'can_view_customers',
        'can_manage_customers',
        'can_manage_expenses',
        'can_view_profit_loss_data',
        'can_export_data',
        'can_manage_reservations',
        'can_manage_payouts',
        'can_send_communications',
        'can_view_rider_profile',
        'can_manage_promotions',
        'is_immutable',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'can_access_dashboard' => 'boolean',
        'can_manage_users' => 'boolean',
        'can_manage_menu' => 'boolean',
        'can_manage_settings' => 'boolean',
        'can_create_orders' => 'boolean',
        'can_view_all_orders' => 'boolean',
        'can_edit_orders' => 'boolean',
        'can_update_order_status' => 'boolean',
        'can_manage_finance' => 'boolean',
        'can_view_reports' => 'boolean',
        'can_perform_delivery' => 'boolean',
        'can_perform_shifts' => 'boolean',
        'can_manage_shop_settings' => 'boolean',
        'can_manage_payment_methods' => 'boolean',
        'can_manage_staff' => 'boolean',
        'can_manage_roles_and_permissions' => 'boolean',
        'can_view_user_activity_log' => 'boolean',
        'can_view_products' => 'boolean',
        'can_manage_products' => 'boolean',
        'can_manage_categories' => 'boolean',
        'can_import_products' => 'boolean',
        'can_export_products' => 'boolean',
        'can_use_pos' => 'boolean',
        'can_view_sales_history' => 'boolean',
        'can_view_customers' => 'boolean',
        'can_manage_customers' => 'boolean',
        'can_manage_expenses' => 'boolean',
        'can_view_profit_loss_data' => 'boolean',
        'can_export_data' => 'boolean',
        'can_manage_reservations' => 'boolean',
        'can_manage_payouts' => 'boolean',
        'can_send_communications' => 'boolean',
        'can_view_rider_profile' => 'boolean',
        'can_manage_promotions' => 'boolean',
        'is_immutable' => 'boolean',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
