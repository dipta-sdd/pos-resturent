<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;
use App\Http\Requests\Menu\StoreItemVariantRequest;
use App\Http\Requests\Menu\UpdateItemVariantRequest;
use App\Models\MenuItem;
use App\Models\ItemVariant;
use Illuminate\Support\Facades\Auth;

class ItemVariantController extends Controller
{
    public function index(MenuItem $menuItem)
    {
        return $menuItem->itemVariants;
    }

    public function store(StoreItemVariantRequest $request, MenuItem $menuItem)
    {
        $this->authorize('create', ItemVariant::class);
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $itemVariant = $menuItem->itemVariants()->create($data);
        return response()->json($itemVariant, 201);
    }

    public function show(MenuItem $menuItem, ItemVariant $variant)
    {
        return $variant;
    }

    public function update(UpdateItemVariantRequest $request, MenuItem $menuItem, ItemVariant $variant)
    {
        $this->authorize('update', $variant);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $variant->update($data);
        return response()->json($variant);
    }

    public function destroy(MenuItem $menuItem, ItemVariant $variant)
    {
        $this->authorize('delete', $variant);
        $variant->delete();
        return response()->json(null, 204);
    }
}
