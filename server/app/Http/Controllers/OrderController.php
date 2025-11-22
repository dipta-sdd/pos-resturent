<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items'])->paginate(10);
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_type' => 'required|in:delivery,dine_in,takeaway',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.item_variant_id' => 'required|exists:item_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.item_name' => 'required|string',
            'items.*.variant_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            DB::beginTransaction();

            $subtotal = 0;
            foreach ($request->items as $item) {
                $subtotal += $item['unit_price'] * $item['quantity'];
            }

            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'user_id' => auth()->id(),
                'status' => 'pending',
                'order_type' => $request->order_type,
                'subtotal' => $subtotal,
                'total_amount' => $subtotal, // Simplified for now
                'payment_status' => 'unpaid',
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'item_variant_id' => $item['item_variant_id'],
                    'item_name' => $item['item_name'],
                    'variant_name' => $item['variant_name'],
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                    'total_price' => $item['unit_price'] * $item['quantity'],
                ]);
            }

            DB::commit();

            return response()->json($order->load('items'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order creation failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $order = Order::with(['user', 'items'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Simplified update
        $order->update($request->only(['special_instructions', 'delivery_address_json']));

        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $order->update(['status' => $request->status]);

        return response()->json($order);
    }

    public function assign($id)
    {
        // Placeholder
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function addPayment($id)
    {
        // Placeholder
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function refundPayment($id, $paymentId)
    {
        // Placeholder
        return response()->json(['message' => 'Not implemented'], 501);
    }

    public function printReceipt($id)
    {
        // Placeholder
        return response()->json(['message' => 'Not implemented'], 501);
    }
}
