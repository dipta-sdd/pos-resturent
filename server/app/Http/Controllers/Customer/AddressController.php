<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreAddressRequest;
use App\Http\Requests\Customer\UpdateAddressRequest;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function index()
    {
        return Auth::user()->addresses()->paginate();
    }

    public function store(StoreAddressRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        $address = Auth::user()->addresses()->create($data);
        return response()->json($address, 201);
    }

    public function show(Address $address)
    {
        $this->authorize('view', $address);
        return $address;
    }

    public function update(UpdateAddressRequest $request, Address $address)
    {
        $this->authorize('update', $address);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();
        $address->update($data);
        return response()->json($address);
    }

    public function destroy(Address $address)
    {
        $this->authorize('delete', $address);
        $address->delete();
        return response()->json(null, 204);
    }
}
