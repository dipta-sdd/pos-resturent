<?php

namespace App\Http\Requests\Finance;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateExpenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->role->can_manage_finance;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'expense_category_id' => 'sometimes|exists:expense_categories,id',
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'amount' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'expense_date' => 'sometimes|date',
            'receipt_image_url' => 'nullable|string|max:255',
        ];
    }
}
