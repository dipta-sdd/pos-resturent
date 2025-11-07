<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'name',
        // Shop & Organization Permissions
        'can_manage_shop_settings',
        'can_manage_payment_methods',
        // User Management Permissions
        'can_manage_staff',
        'can_manage_roles_and_permissions',
        'can_view_user_activity_log',
        // Product & Catalog Permissions
        'can_view_products',
        'can_manage_products',
        'can_manage_categories',
        'can_import_products',
        'can_export_products',
        // Sales & POS Permissions
        'can_use_pos',
        'can_view_sales_history',
        // Customer Management Permissions
        'can_view_customers',
        'can_manage_customers',
        // Financial & Cash Management Permissions
        // Reports & Analytics Permissions
        'can_manage_expenses',
        'can_view_dashboard',
        'can_view_reports',
        'can_view_profit_loss_data',
        'can_export_data',
        // Audit fields
        'created_by',
        'updated_by',
    ];

    protected $casts = [
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
        'can_view_dashboard' => 'boolean',
        'can_view_reports' => 'boolean',
        'can_view_profit_loss_data' => 'boolean',
        'can_export_data' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];



    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}