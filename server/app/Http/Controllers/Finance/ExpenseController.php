<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Finance\StoreExpenseRequest;
use App\Http\Requests\Finance\UpdateExpenseRequest;
use App\Models\Expense;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Expense::class);
        return Expense::with(['category', 'paymentMethod'])->paginate();
    }

    public function store(StoreExpenseRequest $request)
    {
        $this->authorize('create', Expense::class);
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $expense = Expense::create($data);
        return response()->json($expense, 201);
    }

    public function show(Expense $expense)
    {
        $this->authorize('view', $expense);
        return $expense->load(['category', 'paymentMethod']);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $this->authorize('update', $expense);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $expense->update($data);
        return response()->json($expense);
    }

    public function destroy(Expense $expense)
    {
        $this->authorize('delete', $expense);
        $expense->delete();
        return response()->json(null, 204);
    }
}
