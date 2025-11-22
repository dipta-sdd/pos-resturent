<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\StartShiftRequest;
use App\Http\Requests\Staff\EndShiftRequest;
use App\Models\StaffShift;
use Illuminate\Support\Facades\Auth;

class ShiftController extends Controller
{
    public function start(StartShiftRequest $request)
    {
        $shift = StaffShift::create([
            'user_id' => Auth::id(),
            'start_time' => now(),
            'starting_cash' => $request->starting_cash,
        ]);
        return response()->json($shift, 201);
    }

    public function current()
    {
        $shift = StaffShift::where('user_id', Auth::id())->where('status', 'open')->firstOrFail();
        // In a real application, you would calculate the cash sales expected here
        // based on the orders processed during the shift.
        return response()->json($shift);
    }

    public function end(EndShiftRequest $request)
    {
        $shift = StaffShift::where('user_id', Auth::id())->where('status', 'open')->firstOrFail();
        $shift->update([
            'end_time' => now(),
            'cash_sales_actual' => $request->cash_sales_actual,
            'status' => 'closed',
        ]);
        return response()->json($shift);
    }

    public function report(StaffShift $shift)
    {
        $this->authorize('view', $shift);
        return response()->json($shift);
    }
}
