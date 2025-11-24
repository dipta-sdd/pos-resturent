<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;

use App\Models\MenuItem;
use App\Models\Category;
use App\Models\AddOn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with(['category', 'variants']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('category_id') && $request->category_id != 'all') {
            $query->where('category_id', $request->category_id);
        }

        $perPage = $request->input('per_page', 10);
        $menuItems = $query->paginate($perPage);
        return response()->json($menuItems);
    }

    public function allItems()
    {
        $menuItems = MenuItem::with(['category', 'variants'])->get();
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
            'is_featured' => 'boolean',
            // Variants are required
            'variants' => 'required|array|min:1',
            'variants.*.name' => 'required|string|max:100',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            // Use transaction to create item and variants together
            $menuItem = \DB::transaction(function () use ($request) {
                $data = $request->except('variants');
                $data['slug'] = Str::slug($request->name);

                $menuItem = MenuItem::create($data);

                // Create variants
                foreach ($request->variants as $variantData) {
                    $menuItem->variants()->create($variantData);
                }

                // Load relationships for response
                $menuItem->load(['category', 'variants']);

                return $menuItem;
            });

            return response()->json($menuItem, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create menu item', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $menuItem = MenuItem::with(['category', 'variants', 'addOns'])->find($id);

        if (!$menuItem) {
            return response()->json(['message' => 'Menu Item not found'], 404);
        }
        $category = Category::all();
        $addOns = AddOn::all();
        return response()->json([
            'menu_item' => $menuItem,
            'categories' => $category,
            'add_ons' => $addOns,
        ]);
    }
    public function get_resource()
    {
        $category = Category::all();
        $addOns = AddOn::all();
        return response()->json([
            'categories' => $category,
            'add_ons' => $addOns,
        ]);
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
