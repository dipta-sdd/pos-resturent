<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Order::class);
        return Order::with(['user', 'table', 'rider', 'staff', 'items', 'payments'])->paginate();
    }

    public function store(StoreOrderRequest $request)
    {
        $this->authorize('create', Order::class);
        $data = $request->validated();
        $data['order_number'] = 'ORD-' . strtoupper(Str::random(10));
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $order = Order::create($data);
        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        return $order->load(['user', 'table', 'rider', 'staff', 'items', 'payments']);
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $this->authorize('update', $order);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $order->update($data);
        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);
        $order->delete();
        return response()->json(null, 204);
    }
}
