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
