<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\PayoutRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PayoutController extends Controller
{
    public function update(Request $request, PayoutRequest $payoutRequest)
    {
        $this->authorize('update', $payoutRequest);
        $request->validate(['status' => 'required|in:approved,rejected']);
        $payoutRequest->update($request->only('status'));
        return response()->json($payoutRequest);
    }

    public function store(Request $request)
    {
        $this->authorize('create', PayoutRequest::class);
        $request->validate(['amount' => 'required|numeric|min:0']);
        $payoutRequest = Auth::user()->payoutRequests()->create($request->only('amount'));
        return response()->json($payoutRequest, 201);
    }
}
