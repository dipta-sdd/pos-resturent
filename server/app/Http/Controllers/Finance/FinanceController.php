<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Order;

class FinanceController extends Controller
{
    public function stats()
    {
        $totalSales = Order::where('payment_status', 'paid')->sum('total_amount');
        $totalExpenses = Expense::sum('amount');
        $netProfit = $totalSales - $totalExpenses;

        return response()->json([
            'total_sales' => $totalSales,
            'total_expenses' => $totalExpenses,
            'net_profit' => $netProfit,
        ]);
    }
}
