<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreReservationRequest;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function index()
    {
        return Auth::user()->reservations()->with('table')->paginate();
    }

    public function store(StoreReservationRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $reservation = Auth::user()->reservations()->create($data);
        return response()->json($reservation, 201);
    }
}
