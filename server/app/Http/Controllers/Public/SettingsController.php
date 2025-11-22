<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;

class SettingsController extends Controller
{
    public function index()
    {
        return SystemSetting::all();
    }
}
