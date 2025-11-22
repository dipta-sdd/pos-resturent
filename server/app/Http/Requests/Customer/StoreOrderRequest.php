<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => 'in:pending,confirmed,preparing,ready,out_for_delivery,delivered,cancelled',
            'order_type' => 'required|in:delivery,dine_in,takeaway',
            'payment_status' => 'in:unpaid,partial,paid,refunded',
            'delivery_address_json' => 'nullable|json',
            'coupon_code' => 'nullable|string|max:50',
            'subtotal' => 'required|numeric|min:0',
            'tax_amount' => 'numeric|min:0',
            'discount_amount' => 'numeric|min:0',
            'delivery_charge' => 'numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'numeric|min:0',
            'table_id' => 'nullable|exists:dining_tables,id',
        ];
    }
}
