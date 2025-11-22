<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;

class MenuItemController extends Controller
{
    public function index()
    {
        return MenuItem::where('is_active', true)->with(['category', 'itemVariants', 'addOns'])->paginate();
    }

    public function show(MenuItem $menuItem)
    {
        return $menuItem->load(['category', 'itemVariants', 'addOns']);
    }
}
