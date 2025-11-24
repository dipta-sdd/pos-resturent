<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;
use App\Models\ItemVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ItemVariantController extends Controller
{
    /**
     * Display a listing of item variants for a specific menu item.
     */
    public function index(Request $request)
    {
        $query = ItemVariant::with('menuItem');

        // Filter by menu_item_id if provided
        if ($request->has('menu_item_id')) {
            $query->where('menu_item_id', $request->menu_item_id);
        }

        $variants = $query->paginate(10);
        return response()->json($variants);
    }

    /**
     * Store a newly created item variant.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'menu_item_id' => 'required|exists:menu_items,id',
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $variant = ItemVariant::create($request->all());

        return response()->json($variant, 201);
    }

    /**
     * Display the specified item variant.
     */
    public function show($id)
    {
        $variant = ItemVariant::with('menuItem')->find($id);

        if (!$variant) {
            return response()->json(['message' => 'Item variant not found'], 404);
        }

        return response()->json($variant);
    }

    /**
     * Update the specified item variant.
     */
    public function update(Request $request, $id)
    {
        $variant = ItemVariant::find($id);

        if (!$variant) {
            return response()->json(['message' => 'Item variant not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'menu_item_id' => 'sometimes|required|exists:menu_items,id',
            'name' => 'sometimes|required|string|max:100',
            'price' => 'sometimes|required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $variant->update($request->all());

        return response()->json($variant);
    }

    /**
     * Remove the specified item variant.
     */
    public function destroy($id)
    {
        $variant = ItemVariant::find($id);

        if (!$variant) {
            return response()->json(['message' => 'Item variant not found'], 404);
        }

        $variant->delete();

        return response()->json(['message' => 'Item variant deleted successfully']);
    }

    /**
     * Update the availability status of an item variant.
     */
    public function updateAvailability(Request $request, $id)
    {
        $variant = ItemVariant::find($id);

        if (!$variant) {
            return response()->json(['message' => 'Item variant not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $variant->update(['is_active' => $request->is_active]);

        return response()->json($variant);
    }
}
