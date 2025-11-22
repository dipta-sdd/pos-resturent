<?php

namespace App\Http\Controllers\Rider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rider\UpdateRiderRequest;
use App\Http\Requests\Rider\UpdateRiderLocationRequest;
use App\Models\Order;
use App\Models\RiderProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RiderController extends Controller
{
    public function dashboard()
    {
        $rider = Auth::user()->riderProfile;
        $orders = Order::where('rider_id', Auth::id())->where('status', 'out_for_delivery')->get();
        return response()->json([
            'rider' => $rider,
            'orders' => $orders,
        ]);
    }

    public function updateStatus(UpdateRiderRequest $request)
    {
        $rider = Auth::user()->riderProfile;
        $rider->update($request->validated());
        return response()->json($rider);
    }

    public function updateLocation(UpdateRiderLocationRequest $request)
    {
        $rider = Auth::user()->riderProfile;
        $rider->update($request->validated());
        return response()->json($rider);
    }

    public function orders()
    {
        return Order::where('rider_id', Auth::id())->paginate();
    }

    public function uploadDocuments(Request $request)
    {
        // Placeholder for document upload logic
        return response()->json(['message' => 'Documents uploaded successfully.']);
    }
}
