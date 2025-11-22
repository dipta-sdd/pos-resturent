<?php

namespace App\Http\Requests\System;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->role->can_manage_users;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50|unique:roles,name',
            'slug' => 'required|string|max:50|unique:roles,slug',
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
    }
}
