<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Finance\StoreExpenseCategoryRequest;
use App\Http\Requests\Finance\UpdateExpenseCategoryRequest;
use App\Models\ExpenseCategory;
use Illuminate\Support\Facades\Auth;

class ExpenseCategoryController extends Controller
{
    public function index()
    {
        return ExpenseCategory::paginate();
    }

    public function store(StoreExpenseCategoryRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $expenseCategory = ExpenseCategory::create($data);
        return response()->json($expenseCategory, 201);
    }

    public function show(ExpenseCategory $expenseCategory)
    {
        $this->authorize('view', $expenseCategory);
        return $expenseCategory;
    }

    public function update(UpdateExpenseCategoryRequest $request, ExpenseCategory $expenseCategory)
    {
        $this->authorize('update', $expenseCategory);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $expenseCategory->update($data);
        return response()->json($expenseCategory);
    }

    public function destroy(ExpenseCategory $expenseCategory)
    {
        $this->authorize('delete', $expenseCategory);
        $expenseCategory->delete();
        return response()->json(null, 204);
    }
}
