<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->role->can_edit_orders;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'sometimes|nullable|exists:users,id',
            'status' => 'sometimes|in:pending,confirmed,preparing,ready,out_for_delivery,delivered,cancelled',
            'order_type' => 'sometimes|in:delivery,dine_in,takeaway',
            'payment_status' => 'sometimes|in:unpaid,partial,paid,refunded',
            'delivery_address_json' => 'sometimes|nullable|json',
            'coupon_code' => 'sometimes|nullable|string|max:50',
            'subtotal' => 'sometimes|numeric|min:0',
            'tax_amount' => 'sometimes|numeric|min:0',
            'discount_amount' => 'sometimes|numeric|min:0',
            'delivery_charge' => 'sometimes|numeric|min:0',
            'total_amount' => 'sometimes|numeric|min:0',
            'paid_amount' => 'sometimes|numeric|min:0',
            'table_id' => 'sometimes|nullable|exists:dining_tables,id',
            'rider_id' => 'sometimes|nullable|exists:users,id',
            'staff_id' => 'sometimes|nullable|exists:users,id',
        ];
    }
}
