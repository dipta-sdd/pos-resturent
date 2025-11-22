<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MenuItemController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::with('category')->paginate(10);
        return response()->json($menuItems);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'is_veg' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);

        $menuItem = MenuItem::create($data);

        return response()->json($menuItem, 201);
    }

    public function show($id)
    {
        $menuItem = MenuItem::with(['category', 'itemVariants', 'addOns'])->find($id);

        if (!$menuItem) {
            return response()->json(['message' => 'Menu Item not found'], 404);
        }

        return response()->json($menuItem);
    }

    public function update(Request $request, $id)
    {
        $menuItem = MenuItem::find($id);

        if (!$menuItem) {
            return response()->json(['message' => 'Menu Item not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'is_veg' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->all();
        if ($request->has('name')) {
            $data['slug'] = Str::slug($request->name);
        }

        $menuItem->update($data);

        return response()->json($menuItem);
    }

    public function destroy($id)
    {
        $menuItem = MenuItem::find($id);

        if (!$menuItem) {
            return response()->json(['message' => 'Menu Item not found'], 404);
        }

        $menuItem->delete();

        return response()->json(['message' => 'Menu Item deleted successfully']);
    }

    public function updateStatus(Request $request, $id)
    {
        $menuItem = MenuItem::find($id);

        if (!$menuItem) {
            return response()->json(['message' => 'Menu Item not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $menuItem->update(['is_active' => $request->is_active]);

        return response()->json($menuItem);
    }
}
