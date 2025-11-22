<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;
use App\Http\Requests\Menu\StoreMenuItemRequest;
use App\Http\Requests\Menu\UpdateMenuItemRequest;
use App\Http\Requests\Menu\UpdateMenuItemStatusRequest;
use App\Models\MenuItem;
use Illuminate\Support\Facades\Auth;

class MenuItemController extends Controller
{
    public function index()
    {
        return MenuItem::with(['category', 'itemVariants', 'addOns'])->paginate();
    }

    public function store(StoreMenuItemRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $menuItem = MenuItem::create($data);
        return response()->json($menuItem, 201);
    }

    public function show(MenuItem $menuItem)
    {
        $this->authorize('view', $menuItem);
        return $menuItem->load(['category', 'itemVariants', 'addOns']);
    }

    public function update(UpdateMenuItemRequest $request, MenuItem $menuItem)
    {
        $this->authorize('update', $menuItem);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $menuItem->update($data);
        return response()->json($menuItem);
    }

    public function destroy(MenuItem $menuItem)
    {
        $this->authorize('delete', $menuItem);
        $menuItem->delete();
        return response()->json(null, 204);
    }

    public function updateStatus(UpdateMenuItemStatusRequest $request, MenuItem $menuItem)
    {
        $this->authorize('update', $menuItem);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $menuItem->update($data);
        return response()->json($menuItem);
    }
}
