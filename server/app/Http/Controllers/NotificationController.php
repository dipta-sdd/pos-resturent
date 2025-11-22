<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        return Auth::user()->notifications()->paginate();
    }

    public function markAsRead(Request $request)
    {
        Auth::user()->unreadNotifications()->whereIn('id', $request->input('ids', []))->update(['read_at' => now()]);
        return response()->json(['message' => 'Notifications marked as read.']);
    }
}
