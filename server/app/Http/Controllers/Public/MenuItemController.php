<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;

class MenuItemController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::with('variants', 'addOns')->get();
        return response()->json($menuItems);
    }

    public function show($slug)
    {
        $menuItem = MenuItem::with('variants', 'addOns')->where('slug', $slug)->first();
        return response()->json($menuItem);
    }

    public function featuredItems()
    {
        $menuItems = MenuItem::with('variants', 'addOns')->orderBy('is_featured', 'desc')->limit(8)->get();
        return response()->json($menuItems);
    }
}
