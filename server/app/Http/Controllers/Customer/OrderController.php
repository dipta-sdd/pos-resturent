<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreOrderRequest;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        return Auth::user()->orders()->with(['table', 'items', 'payments'])->paginate();
    }

    public function store(StoreOrderRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $order = Auth::user()->orders()->create($data);
        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        return $order->load(['table', 'items', 'payments']);
    }

    public function cancel(Order $order)
    {
        $this->authorize('update', $order);
        $order->update([
            'status' => Order::STATUS_CANCELLED,
            'updated_by' => Auth::id(),
        ]);
        return response()->json($order);
    }
}
